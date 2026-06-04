import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Studio Motian.",
};

export default function ContactPage() {
  return (
    <section className="container-x pb-16 pt-40 md:pt-48">
      <div className="max-w-2xl">
        <h1 className="text-[15px] text-ink">Contact</h1>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted">
          프로젝트 문의를 남겨주시면 영업일 기준 2–3일 내에 회신드립니다.
        </p>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
