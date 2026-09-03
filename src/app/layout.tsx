import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import BottomBlur from "@/components/BottomBlur";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nikolastanner.com"),
  title: "Nikolas Tanner",
  description: "Nikolas Tanner — Software Engineer",
  icons: {
    icon: "/newIcon.png",
  },
  openGraph: {
    title: "Nikolas Tanner",
    description: "Nikolas Tanner — Software Engineer",
    url: "https://nikolastanner.com",
    siteName: "Nikolas Tanner",
    type: "website",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 628,
        alt: "Nikolas Tanner — Software Engineer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="bg-bg text-text font-light min-h-screen">
        {children}
        <BottomBlur />
        <Analytics />
      </body>
    </html>
  );
}
