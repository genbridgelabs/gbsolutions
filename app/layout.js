import { Gloock, Schibsted_Grotesk } from "next/font/google";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "GB Solutions — Interior architecture and turnkey build, Odisha",
    template: "%s — GB Solutions",
  },
  description:
    "GB Solutions is an interior architecture and turnkey build studio in Bhubaneswar. Rooms planned for Odisha's light, monsoon and the way families actually live — drawn, sourced and built by one team.",
  keywords: [
    "interior designer Bhubaneswar",
    "turnkey interior Odisha",
    "architect Cuttack",
    "luxury interiors Puri",
    "GB Solutions",
  ],
  openGraph: {
    title: "GB Solutions — Interior architecture and turnkey build",
    description:
      "An interior architecture and turnkey build studio in Bhubaneswar, working across Odisha.",
    type: "website",
    images: ["/media/project-monolith.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#e7e2d6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${gloock.variable} ${grotesk.variable}`}>
      <body className="min-h-svh antialiased">{children}</body>
    </html>
  );
}
