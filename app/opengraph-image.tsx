import { ImageResponse } from "next/og";

export const alt = "Studio Motian — From a mote of language, to the structure of intent.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAFAF7",
          color: "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#6B6B68",
            fontWeight: 500,
          }}
        >
          <span>Studio Motian</span>
          <span>Brand Design Studio</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              display: "flex",
            }}
          >
            From a mote of language, to the structure of intent.
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#6B6B68",
              fontWeight: 400,
              display: "flex",
            }}
          >
            브랜드의 방향, 언어, 시각 시스템을 설계합니다.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "#6B6B68",
          }}
        >
          <span>studio-motian.com</span>
          <span>스튜디오 모티안</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
