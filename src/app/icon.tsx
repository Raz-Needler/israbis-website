import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default async function Icon() {
  const logoData = await readFile(join(process.cwd(), "public/images/israbis-logo.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          borderRadius: 40,
        }}
      >
        <img
          src={logoBase64}
          width={150}
          height={60}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
