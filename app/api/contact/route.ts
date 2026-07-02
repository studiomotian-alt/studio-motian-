import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  company?: string;
  contact?: string;
  email?: string;
  projectType?: string;
  schedule?: string;
  message?: string;
  website?: string; // honeypot
  turnstileToken?: string; // Cloudflare Turnstile 응답 토큰
};

// 필드별 최대 길이 — 남용/DoS 완화 (모든 필드에 적용)
const LIMITS: Record<string, number> = {
  name: 200,
  company: 200,
  contact: 200,
  email: 320, // RFC 5321 이메일 최대 길이
  projectType: 200,
  schedule: 300,
  message: 5000,
};

// 간단한 인메모리 rate limit. 정상 사용자에겐 영향이 없을 만큼 넉넉하게 둠.
// ⚠️ 서버리스(Vercel)에서는 인스턴스별 분리·콜드스타트 초기화되는 "완화책"일 뿐.
//    실질적 봇 방어는 Cloudflare Turnstile 또는 Upstash 기반으로 별도 보강 필요.
const RATE_LIMIT = 8; // 윈도우당 최대 요청 수 (IP 기준)
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10분
const hits = new Map<string, number[]>();

function rateLimited(ip: string | null): boolean {
  if (!ip) return false; // IP를 식별 못 하면 차단하지 않음(정상 사용자 보호 우선)
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // 메모리 누수 방지: 만료된 항목 정리
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT;
}

// Cloudflare Turnstile 토큰 검증.
// TURNSTILE_SECRET_KEY가 설정돼 있을 때만 호출된다(키 없으면 검증 단계 자체를 건너뜀).
async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string | null,
): Promise<boolean> {
  try {
    const form = new URLSearchParams();
    form.append("secret", secret);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // 검증 호출 자체가 실패하면 안전하게 거부
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  // 과도한 본문 조기 차단
  const declaredLen = Number(req.headers.get("content-length") ?? "0");
  if (declaredLen > 64 * 1024) {
    return NextResponse.json({ error: "요청이 너무 큽니다." }, { status: 413 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "요청이 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // Honeypot — 채워져 있으면 조용히 성공 처리 (봇 차단)
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const company = (body.company ?? "").trim();
  const contact = (body.contact ?? "").trim();
  const email = (body.email ?? "").trim();
  const projectType = (body.projectType ?? "").trim();
  const schedule = (body.schedule ?? "").trim();
  const message = (body.message ?? "").trim();

  // 모든 필드 길이 제한
  const fieldsToCheck = { name, company, contact, email, projectType, schedule, message };
  for (const [key, value] of Object.entries(fieldsToCheck)) {
    if (value.length > (LIMITS[key] ?? 1000)) {
      return NextResponse.json(
        { error: "입력 길이가 너무 깁니다." },
        { status: 400 },
      );
    }
  }

  if (!name || !email || !projectType || !message) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
      { status: 400 },
    );
  }
  // 이메일 형식 — anchor 처리 + 공백 불허
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "이메일 형식을 확인해주세요." },
      { status: 400 },
    );
  }

  // Cloudflare Turnstile 검증 — 시크릿이 설정된 경우에만 강제(설정 전엔 기존 동작 유지).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = (body.turnstileToken ?? "").trim();
    if (!token || !(await verifyTurnstile(token, turnstileSecret, ip))) {
      return NextResponse.json(
        { error: "보안 확인에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요." },
        { status: 403 },
      );
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "studio.motian@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  // 키 누락 처리:
  //  - production: fail-closed(503). "성공"으로 위장하지 않아 문의 유실을 방지.
  //  - development: 폼 흐름 확인용으로만 통과시키되, 개인정보 원문은 로그에 남기지 않음.
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] RESEND_API_KEY missing in production — failing closed");
      return NextResponse.json(
        { error: "현재 문의 접수가 일시적으로 불가합니다. 잠시 후 다시 시도해주세요." },
        { status: 503 },
      );
    }
    console.warn(
      `[contact] dev: RESEND_API_KEY not set — not sent. lengths name=${name.length} email=${email.length} message=${message.length}`,
    );
    return NextResponse.json({ ok: true, logged: true });
  }

  const resend = new Resend(apiKey);

  const fields: { label: string; value: string }[] = [
    { label: "Name / 이름", value: name },
    { label: "Company or Brand / 회사명", value: company },
    { label: "Contact / 연락처", value: contact },
    { label: "Email / 이메일", value: email },
    { label: "Project Type / 문의 분야", value: projectType },
    { label: "Expected Schedule / 희망 일정", value: schedule },
  ].filter((f) => f.value);

  const subject = `[Studio Motian] 새 문의 — ${name} (${projectType})`;
  const rows = fields
    .map(
      (f) =>
        `<tr><td style="padding: 10px 0; color: #6B6B68; width: 200px; font-size: 12px;">${escapeHtml(
          f.label,
        )}</td><td style="padding: 10px 0; font-size: 14px;">${escapeHtml(
          f.value,
        )}</td></tr>`,
    )
    .join("");
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; color: #111; line-height: 1.6; max-width: 600px;">
      <h2 style="font-weight: 400; font-size: 20px; margin: 0 0 24px;">Studio Motian 새 문의</h2>
      <table style="width: 100%; border-collapse: collapse;">${rows}</table>
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E5E5E0;">
        <div style="color: #6B6B68; font-size: 12px; margin-bottom: 12px;">Message / 문의 내용</div>
        <div style="white-space: pre-wrap; font-size: 14px;">${escapeHtml(message)}</div>
      </div>
    </div>
  `;
  const text =
    `Studio Motian 새 문의\n\n` +
    fields.map((f) => `${f.label}: ${f.value}`).join("\n") +
    `\n\n--- Message / 문의 내용 ---\n${message}\n`;

  try {
    const { error } = await resend.emails.send({
      from: `Studio Motian Website <${from}>`,
      to: [to],
      subject,
      html,
      text,
      replyTo: email,
    });
    if (error) {
      // 전송 실패 메타만 기록 (제출 내용/개인정보는 로깅하지 않음)
      console.error("[contact] resend error");
      return NextResponse.json(
        { error: "전송 중 오류가 발생했습니다." },
        { status: 502 },
      );
    }
  } catch {
    console.error("[contact] send failed");
    return NextResponse.json(
      { error: "전송 중 오류가 발생했습니다." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
