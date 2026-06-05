import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Studio Motian designs the direction, language, and visual systems of brands.",
};

const services = [
  { num: "01", title: "Brand Strategy", desc: "브랜드의 방향과 기준을 정의합니다" },
  { num: "02", title: "Brand Naming & Language", desc: "브랜드의 이름과 메시지를 설계합니다" },
  { num: "03", title: "Visual Direction", desc: "브랜드의 시각적 방향을 설정합니다" },
  { num: "04", title: "Brand Identity Design", desc: "브랜드의 시각 체계를 구축합니다" },
  {
    num: "05",
    title: "Application Design",
    desc: "브랜드가 적용되는 모든 접점을 디자인합니다",
  },
  {
    num: "06",
    title: "Brand Guideline",
    desc: "브랜드가 일관되게 유지될 수 있도록 정리합니다",
  },
];

const process = [
  {
    num: "01",
    name: "Define",
    duration: "약 1주",
    desc: "브랜드의 방향과 기준을 정리하는 단계",
    items: [
      "브랜드 인터뷰지 작성",
      "대면 인터뷰 및 초기 미팅",
      "브랜드 진단 및 리서치",
      "프로젝트 범위 및 일정 확정",
    ],
  },
  {
    num: "02",
    name: "Develop",
    duration: "약 2주",
    desc: "브랜드의 전략과 방향을 구체화하는 단계",
    items: [
      "브랜드 전략 개발 및 제안",
      "전략 수정 및 확정 (최대 1회)",
      "네이밍 / 슬로건 개발 및 제안 (2안 제안 후 선택, 최대 1회 수정)",
    ],
  },
  {
    num: "03",
    name: "Design",
    duration: "약 2-3주",
    desc: "브랜드의 시각적 구조를 설계하는 단계",
    items: [
      "비주얼 디렉션 제안 (2안 / 대면 브리핑)",
      "방향 선택 후 디벨롭 (최대 2회 수정)",
      "로고 및 그래픽 시스템 확정",
    ],
  },
  {
    num: "04",
    name: "Apply",
    duration: "약 2-4주",
    desc: "브랜드를 실제 접점에 적용하는 단계",
    items: [
      "어플리케이션 항목 확정",
      "디자인 전개 (2안 제안 후 선택, 최대 2회 수정)",
      "최종 디자인 정리 및 전달",
    ],
  },
];

const timeline = [
  { label: "Brand Base", value: "약 7-8주" },
  { label: "Brand Build", value: "약 10-12주" },
];

export default function AboutPage() {
  return (
    <section
      className="relative min-h-[100svh] overflow-hidden px-6 pb-12 md:px-12 md:pb-16 lg:px-16"
    >
      {/* Left background illustration (decorative) — same height as home */}
      <div className="pointer-events-none absolute left-0 top-[14%] -z-10 hidden md:block">
        <Image
          src="/about_bg.png"
          alt=""
          width={405}
          height={719}
          className="h-[700px] w-auto max-w-none"
        />
      </div>

      <div className="relative z-10 grid max-w-5xl grid-cols-1 gap-12 pt-28 md:grid-cols-10 md:gap-10 md:pt-48">
        {/* Our Services — left, with faint background illustration */}
        <div className="relative md:col-span-4">
          <h2 className="text-[15px] text-ink">Our Services</h2>
          <ul className="mt-8 space-y-7">
            {services.map((s) => (
              <li key={s.num}>
                <div className="flex items-baseline gap-3 text-[13px] text-ink">
                  <span className="tabular-nums">{s.num}</span>
                  <span className="text-muted">|</span>
                  <span>{s.title}</span>
                </div>
                <p className="mt-1.5 text-[12px] text-muted">{s.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Project Process — center */}
        <div className="md:col-span-6">
          <h2 className="text-[15px] text-ink">Project Process</h2>
          <div className="mt-8 border-t border-line">
            {process.map((p) => (
              <div
                key={p.num}
                className="grid grid-cols-1 gap-3 border-b border-line py-5 md:grid-cols-[1fr_1.35fr] md:gap-8"
              >
                <div>
                  <div className="flex items-baseline gap-2 text-[13px] text-ink">
                    <span className="tabular-nums">{p.num}</span>
                    <span>{p.name}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted">
                    ({p.duration})
                  </div>
                  <div className="mt-3 text-[12px] text-muted">{p.desc}</div>
                </div>

                <ul className="space-y-1.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2 text-[12px] text-ink">
                      <span className="text-muted">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                  {p.num === "04" && (
                    <li className="flex gap-2 pt-2 text-[12px] text-ink">
                      <span className="text-muted">•</span>
                      <div>
                        <div>Project Timeline</div>
                        <div className="mt-1 space-y-0.5 text-[11px] text-muted">
                          {timeline.map((t) => (
                            <div key={t.label}>
                              {t.label}: {t.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
