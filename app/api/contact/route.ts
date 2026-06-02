import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  contact?: string;
  projectType?: string;
  message?: string;
  reference?: string;
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
  const contact = (body.contact ?? "").trim();
  const projectType = (body.projectType ?? "").trim();
  const message = (body.message ?? "").trim();
  const reference = (body.reference ?? "").trim();

  if (!name || !contact || !projectType || !message) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
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

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not configured — logging only");
    console.info("[contact] submission", { name, contact, projectType, message, reference });
    return NextResponse.json({ ok: true, logged: true });
  }

  const resend = new Resend(apiKey);

  const subject = `[Studio Motian] 새 문의 — ${name} (${projectType})`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif; color: #111; line-height: 1.6; max-width: 560px;">
      <h2 style="font-weight: 400; font-size: 20px; margin: 0 0 24px;">Studio Motian 새 문의</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 12px 0; color: #6B6B68; width: 140px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Name / Company</td><td style="padding: 12px 0; font-size: 14px;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 12px 0; color: #6B6B68; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Contact</td><td style="padding: 12px 0; font-size: 14px;">${escapeHtml(contact)}</td></tr>
        <tr><td style="padding: 12px 0; color: #6B6B68; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Project Type</td><td style="padding: 12px 0; font-size: 14px;">${escapeHtml(projectType)}</td></tr>
        ${reference ? `<tr><td style="padding: 12px 0; color: #6B6B68; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Reference</td><td style="padding: 12px 0; font-size: 14px;">${escapeHtml(reference)}</td></tr>` : ""}
      </table>
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E5E5E0;">
        <div style="color: #6B6B68; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px;">Message</div>
        <div style="white-space: pre-wrap; font-size: 14px;">${escapeHtml(message)}</div>
      </div>
    </div>
  `;
  const text =
    `Studio Motian 새 문의\n\n` +
    `Name / Company: ${name}\n` +
    `Contact: ${contact}\n` +
    `Project Type: ${projectType}\n` +
    (reference ? `Reference: ${reference}\n` : "") +
    `\n--- Message ---\n${message}\n`;

  try {
    const replyTo = /\S+@\S+\.\S+/.test(contact) ? contact : undefined;
    const { error } = await resend.emails.send({
      from: `Studio Motian Website <${from}>`,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
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
