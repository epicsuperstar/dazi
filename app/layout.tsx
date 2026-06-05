import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dazi",
  description: "Activity coordination, reimagined",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
