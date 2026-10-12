import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
// import logo from "@/assets/logo.svg"
// import logo from "@/assets/Logo.png";

import { Providers } from "./providers/providers";
// import logo from "@/assets/home/kkk-logo.png";

export const metadata: Metadata = {
  title: "Who's Weeding",
  description: "Who's Weeding - Find the perfect wedding vendor for your special day",
  icons: {
    // icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="google-translate-script"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Providers>{children}</Providers>

        {/* <Footer /> */}
      </body>
    </html>
  );
}
