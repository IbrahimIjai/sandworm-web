import "@/styles/globals.css";
import "@mysten/dapp-kit/dist/index.css";

import { DM_Mono as DMMono } from "next/font/google";

import { QueryProvider } from "@/providers/query";
import type { ChildrenProps } from "@/types";
import AppProvider from "@/providers/AppProvider";
import Script from "next/script";

export const metadata = {
  description:
    "Explore, query, and visualize blockchain data on Sui, EVM, and other chains with Sandworm, your open-source, SQL-powered data IDE for Web3",
  keywords: "data, web3, blockchain, analytics, sui, base, etherium, indexer",
  title: "Sand Worm",
  icons: {
    icon: "/logo.svg",
  },
};

const dmMono = DMMono({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  weight: ["300", "400", "500"],
});

const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;

export default async function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-C3SMFQWHE8')`}
      </Script>
      <body
        className={`${dmMono.className} h-full flex flex-col justify-between`}
      >
        <section className="flex-1 bg-background">
          <QueryProvider>
            <AppProvider>{children} </AppProvider>
          </QueryProvider>
        </section>
      </body>
    </html>
  );
}
