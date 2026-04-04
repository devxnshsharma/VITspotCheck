import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"
import { KarmaToast } from "@/components/global/karma-toast"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "VITspotCheck | Campus Intelligence Real-Time",
  description: "Real-time campus intelligence platform for VIT students. Track room availability, network speeds, book spaces, and earn karma through crowd-sourced verification.",
  keywords: ["VIT", "campus", "room availability", "booking", "speedtest", "FFCS"],
  authors: [{ name: "VITspotCheck Team" }],
  generator: "Next.js",
  applicationName: "VITspotCheck",
  openGraph: {
    title: "VITspotCheck | Campus Intelligence Real-Time",
    description: "Real-time campus intelligence platform for VIT students",
    type: "website",
    siteName: "VITspotCheck",
  },
  twitter: {
    card: "summary_large_image",
    title: "VITspotCheck | Campus Intelligence Real-Time",
    description: "Real-time campus intelligence platform for VIT students",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#06060A" },
    { media: "(prefers-color-scheme: dark)", color: "#06060A" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.removeAttribute('data-jetski-tab-id')`
          }}
        />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <KarmaToast />
        </Providers>
        <Toaster position="bottom-right" theme="dark" />
        <Analytics />
      </body>
    </html>
  )
}
