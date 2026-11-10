import { Gloock, Schibsted_Grotesk } from "next/font/google";
import {
  jsonLd,
  shareImage,
  siteUrl,
  studioSchema,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
});

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GB Solutions — Interior architecture and turnkey build, Odisha",
    template: "%s — GB Solutions",
  },
  description:
    "GB Solutions is an interior architecture and turnkey build studio in Bhubaneswar. Rooms planned for Odisha's light, monsoon and the way families actually live — drawn, sourced and built by one team.",
  applicationName: "GB Solutions",
  authors: [{ name: "GB Solutions", url: siteUrl }],
  creator: "GB Solutions",
  publisher: "GB Solutions",
  category: "Interior design",
  keywords: [
    "interior designer Bhubaneswar",
    "interior designer Cuttack",
    "interior designer Puri",
    "turnkey interior Odisha",
    "turnkey interior Bhubaneswar",
    "home interior cost Bhubaneswar",
    "modular kitchen Bhubaneswar",
    "luxury interiors Odisha",
    "GB Solutions",
  ],
  openGraph: {
    title: "GB Solutions — Interior architecture and turnkey build",
    description:
      "An interior architecture and turnkey build studio in Bhubaneswar, working across Odisha.",
    url: "/",
    siteName: "GB Solutions",
    locale: "en_IN",
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "GB Solutions — Interior architecture and turnkey build",
    description:
      "An interior architecture and turnkey build studio in Bhubaneswar, working across Odisha.",
    images: [shareImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
  // Local search signals. The coordinates are the studio's Bhubaneswar address.
  other: {
    "geo.region": "IN-OR",
    "geo.placename": "Bhubaneswar",
    "geo.position": "20.2961;85.8245",
    ICBM: "20.2961, 85.8245",
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport = {
  themeColor: "#e7e2d6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${gloock.variable} ${grotesk.variable}`}>
      <body className="min-h-svh antialiased">
        {children}
        {/* One graph for the studio and the site, on every page. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd([studioSchema(), websiteSchema()]),
          }}
        />
      </body>
    </html>
  );
}
