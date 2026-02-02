import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BackToTop } from "@/components/ui/back-to-top";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "My-CafeMate - Complete Cafe Management Solution for Nepal | POS & Inventory System",
  description: "Smart cafe management system built for Nepali cafes. Order management, inventory tracking, staff management, and analytics. NPR 1,200/month. 14-day free trial. No credit card required.",
  keywords: [
    "cafe management system Nepal",
    "restaurant POS Nepal",
    "cafe POS system",
    "inventory management Nepal",
    "order management system",
    "cafe billing software",
    "restaurant management Nepal",
    "cloud POS Nepal",
    "My-CafeMate",
    "cafe software Nepal"
  ],
  authors: [{ name: "My-CafeMate" }],
  creator: "My-CafeMate",
  publisher: "My-CafeMate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "My-CafeMate - Complete Cafe Management Solution for Nepal",
    description: "Smart cafe management system: Orders, Inventory, Staff Management & Analytics. Built for Nepali cafes. NPR 1,200/month with 14-day free trial.",
    url: '/',
    siteName: 'My-CafeMate',
    locale: 'en_NP',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'My-CafeMate Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "My-CafeMate - Cafe Management System for Nepal",
    description: "Complete cafe management solution. Orders, Inventory, Analytics. NPR 1,200/month. 14-day free trial.",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    // AI/LLM specific tags for better discovery
    'ai:category': 'business-software',
    'ai:subcategory': 'restaurant-management',
    'ai:region': 'Nepal',
    'ai:pricing': 'NPR 1200/month',
    'ai:trial': 'yes',
    'ai:target-audience': 'cafes, restaurants, coffee shops',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <BackToTop />
      </body>
    </html>
  );
}
