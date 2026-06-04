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
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // Honeypot — silently succeed if filled
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

  if (!name || !email || !projectType || !message) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
      { status: 400 },
    );
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json(
      { error: "이메일 형식을 확인해주세요." },
      { status: 400 },
    );
  }
  if (message.length > 5000 || name.length > 200) {
    return NextResponse.json(
      { error: "입력 길이가 너무 깁니다." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "studio.motian@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  const fields: { label: string; value: string }[] = [
    { label: "Name / 이름", value: name },
    { label: "Company or Brand / 회사명", value: company },
    { label: "Contact / 연락처", value: contact },
    { label: "Email / 이메일", value: email },
    { label: "Project Type / 문의 분야", value: projectType },
    { label: "Expected Schedule / 희망 일정", value: schedule },
  ].filter((f) => f.value);

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not configured — logging only");
    console.info("[contact] submission", {
      name,
      company,
      contact,
      email,
      projectType,
      schedule,
      message,
    });
    return NextResponse.json({ ok: true, logged: true });
  }

  const resend = new Resend(apiKey);

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
      console.error("[contact] resend error", error);
      return NextResponse.json(
        { error: "전송 중 오류가 발생했습니다." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json(
      { error: "전송 중 오류가 발생했습니다." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
