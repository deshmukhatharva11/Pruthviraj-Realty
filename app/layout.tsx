import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import { Providers } from "./providers"
import ScrollAnimations from "@/components/scroll-animations"

export const metadata: Metadata = {
  title: {
    default: "Pruthviraj Realty | Plots, Homes & Land Investments in Nashik",
    template: "%s | Pruthviraj Realty",
  },
  description:
    "Discover verified farmhouse plots, NA residential developments, commercial spaces, agricultural land and strategic investments with Pruthviraj Realty across Nashik and Maharashtra.",
  keywords: [
    "Pruthviraj Realty",
    "Nashik real estate",
    "farmhouse plots Gangapur Road",
    "NA plots Trimbakeshwar",
    "commercial plots Nashik",
    "agricultural land Maharashtra",
    "luxury homes Nashik",
    "residential plots Nashik",
    "industrial property MIDC Sinnar",
  ],
  authors: [{ name: "Pruthviraj Realty" }],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-pruthviraj.jpeg", type: "image/jpeg" },
    ],
    apple: [{ url: "/favicon.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Pruthviraj Realty",
    title: "Pruthviraj Realty | Plots, Homes & Land Investments in Nashik",
    description:
      "Find verified plots, farmhouses, commercial spaces and investment land in Nashik with Pruthviraj Realty — your trusted property partner.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Pruthviraj Realty — Nashik Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pruthviraj Realty | Nashik Real Estate",
    description: "Find verified plots, farmhouses, commercial spaces and investments in Nashik.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXTAUTH_URL || "https://pruthvirajrealty.in",
  },
}

// Viewport is now a separate export (fixes Next.js 14 warning)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3d2b1f",
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-ivory text-espresso selection:bg-gold/30 selection:text-espresso">
        {/* Google Analytics 4 — only loads when GA_ID is configured */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                });
              `}
            </Script>
          </>
        )}
        <Providers>
          <ScrollAnimations />
          {children}
        </Providers>
      </body>
    </html>
  )
}
