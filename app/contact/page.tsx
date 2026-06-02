import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Studio Motian.",
};

export default function ContactPage() {
  return (
    <>
      <section className="container-x py-10">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href={`mailto:${CONTACT.email}`} className="link-underline">
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Kakao
          </a>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Instagram
          </a>
        </div>
      </section>

      <div className="hairline container-x" />

      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="eyebrow">Inquiry</div>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
