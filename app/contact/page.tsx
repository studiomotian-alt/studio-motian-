import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { CONTACT } from "@/lib/contact";

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

        {/* KakaoTalk quick inquiry */}
        <a
          href={CONTACT.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex flex-col border border-ink px-6 py-3 transition hover:bg-ink"
        >
          <span className="text-[13px] text-ink transition group-hover:text-bg">
            카카오톡으로 간편 문의
          </span>
          <span className="text-[11px] text-muted transition group-hover:text-bg/70">
            Contact via KakaoTalk
          </span>
        </a>

        <div className="mt-12 border-t border-line pt-12">
          <p className="mb-8 text-[11px] text-muted">
            또는 아래 양식으로 문의해주세요 / Or send us the details below
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
