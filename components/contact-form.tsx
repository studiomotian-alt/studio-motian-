"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const LABEL = "block text-[11px] tracking-wide text-muted";
const INPUT =
  "mt-2 w-full border-0 border-b border-line bg-transparent py-2 text-[13px] text-ink outline-none transition-colors focus:border-ink";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      company: String(data.get("company") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      email: String(data.get("email") || "").trim(),
      projectType: String(data.get("projectType") || "").trim(),
      schedule: String(data.get("schedule") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-[13px] text-ink">
        <p>문의가 접수되었습니다. 감사합니다.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-underline mt-5 text-sm"
        >
          Send another / 다시 작성
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field name="name" label="Name / 이름" required autoComplete="name" />
        <Field
          name="company"
          label="Company or Brand / 회사명 또는 브랜드명"
          autoComplete="organization"
        />
        <Field name="contact" label="Contact / 연락처" autoComplete="tel" />
        <Field
          name="email"
          label="Email / 이메일"
          type="email"
          required
          autoComplete="email"
        />

        <Field
          name="projectType"
          label="Project Type / 문의 분야"
          required
          placeholder="예: 브랜드 아이덴티티, 패키지 디자인"
        />

        <Field
          name="schedule"
          label="Expected Schedule / 희망 일정"
          placeholder="예: 6월 런칭 희망, 3월 프로젝트 시작"
        />
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          Message / 문의 내용
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full resize-none border-0 border-b border-line bg-transparent py-2 text-[13px] leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-ink"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="link-underline text-sm disabled:opacity-50"
        >
          {status === "submitting" ? "Sending… / 전송 중" : "Send / 보내기"}
        </button>
      </div>

      {status === "error" && error && (
        <div className="text-xs text-ink">{error}</div>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={LABEL}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${INPUT} placeholder:text-muted/70`}
      />
    </div>
  );
}
