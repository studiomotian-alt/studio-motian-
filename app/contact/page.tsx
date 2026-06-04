import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Studio Motian.",
};

export default function ContactPage() {
  return (
    <section className="container-x pb-12 pt-36 md:pt-44">
      <div className="max-w-2xl">
        <h1 className="text-[15px] text-ink">Contact</h1>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
          프로젝트 문의를 남겨주시면 영업일 기준 2–3일 내에 회신드립니다.
        </p>

        {/* KakaoTalk quick inquiry — slim */}
        <a
          href={CONTACT.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-5 inline-flex items-baseline gap-2.5 border border-ink px-5 py-2 transition hover:bg-ink"
        >
          <span className="text-[13px] text-ink transition group-hover:text-bg">
            카카오톡으로 간편 문의
          </span>
          <span className="text-[11px] text-muted transition group-hover:text-bg/70">
            Contact via KakaoTalk
          </span>
        </a>

        <div className="mt-8">
          <p className="mb-5 text-[11px] text-muted">
            또는 아래 양식으로 문의해주세요 / Or send us the details below
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
