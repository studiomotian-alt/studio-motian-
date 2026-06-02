"use client";

import { useState } from "react";
import { PROJECT_TYPES } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

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
      contact: String(data.get("contact") || "").trim(),
      projectType: String(data.get("projectType") || "").trim(),
      message: String(data.get("message") || "").trim(),
      reference: String(data.get("reference") || "").trim(),
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
        throw new Error(
          body?.error || "Something went wrong. Please try again.",
        );
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
      <div className="text-sm text-ink">
        <p>Message received.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-underline mt-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field id="name" name="name" label="Name" required />
      <Field id="contact" name="contact" label="Email or phone" required />

      <div>
        <label htmlFor="projectType" className="eyebrow block">
          Project type
        </label>
        <div className="mt-2 border-b border-line">
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            className="w-full appearance-none border-0 bg-transparent py-2 text-sm text-ink outline-none focus:ring-0"
          >
            <option value="" disabled>
              Select
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full resize-none border-0 border-b border-line bg-transparent py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-ink"
        />
      </div>

      <Field id="reference" name="reference" label="Reference (optional)" />

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="link-underline text-sm disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
      </div>

      {status === "error" && error && (
        <div className="text-xs text-ink">{error}</div>
      )}
    </form>
  );
}

function Field({
  id,
  name,
  label,
  required,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        required={required}
        className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 text-sm text-ink outline-none focus:border-ink"
      />
    </div>
  );
}
