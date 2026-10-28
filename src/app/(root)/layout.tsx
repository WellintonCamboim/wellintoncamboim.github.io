import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Wellinton Camboim",
};

export default function RootChooserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <meta httpEquiv="refresh" content="0; url=/pt/" />
      </head>
      <body>{children}</body>
    </html>
  );
}
