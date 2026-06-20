import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Workfolio Builder",
  description:
    "Turn your skills, experience, and projects into a portfolio site, resume, and LinkedIn summary.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
