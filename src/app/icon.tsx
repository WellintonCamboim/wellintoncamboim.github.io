import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

// Simple generated mark (initial + brand colors) instead of a photo — no
// profile image has been confirmed yet (content/_todo.md).
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0e11",
        borderRadius: 6,
        color: "#39d2c0",
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      W
    </div>,
    { ...size },
  );
}
