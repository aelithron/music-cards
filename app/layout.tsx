import type { Metadata } from "next";
import { Zain } from "next/font/google";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const zain = Zain({ subsets: ["latin"], weight: ["400"] });
export const metadata: Metadata = {
  title: {
    template: "%s | Music Cards",
    default: "Music Cards"
  },
  description: "Play music through a cool UI with virtual song cards!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${zain.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
