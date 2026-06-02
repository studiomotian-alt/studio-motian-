import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111111",
          color: "#FAFAF7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 300,
          letterSpacing: "-0.04em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
