import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Nikolas Tanner",
  description: "Nikolas Tanner — Software Engineer",
  icons: {
    icon: "/tang.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="bg-bg text-text font-light min-h-screen">{children}</body>
    </html>
  );
}
