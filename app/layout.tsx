import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free ATS Resume Builder | Create Professional Resume Online",
  description: "Build ATS-friendly resumes with our free chatbot interface. Get hired faster with optimized resume templates and instant PDF download.",
  keywords: "ATS resume builder, free resume maker, resume chatbot, ATS friendly resume, professional resume, resume templates, job application, career tools",
  authors: [{ name: "ATS Resume Chatbot" }],
  robots: "index, follow",
  openGraph: {
    title: "Free ATS Resume Builder | Create Professional Resume Online",
    description: "Build ATS-friendly resumes with our free chatbot interface. Get hired faster with optimized resume templates and instant PDF download.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ATS Resume Chatbot",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ATS Resume Builder - Create Professional Resumes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Builder | Create Professional Resume Online",
    description: "Build ATS-friendly resumes with our free chatbot interface. Get hired faster with optimized resume templates and instant PDF download.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
