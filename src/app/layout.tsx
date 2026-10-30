import type { Metadata } from "next";
import { Figtree, Noto_Serif_SC } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import BottomBlur from "@/components/BottomBlur";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-figtree",
});

/* Only the Chinese name and idiom use this, so load the light weight only. */
const notoSerifSC = Noto_Serif_SC({
  weight: ["300"],
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
  display: "swap",
  preload: false,
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
    <html lang="en" className={`${figtree.variable} ${notoSerifSC.variable}`} suppressHydrationWarning>
      <head>
        {/* Resolve the theme before first paint: a saved choice wins, then
            the OS preference. Runs inline so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
          }}
        />
      </head>
      <body className="bg-bg text-text font-light min-h-screen">
        {children}
        <ThemeToggle />
        <BottomBlur />
        <Analytics />
      </body>
    </html>
  );
}
