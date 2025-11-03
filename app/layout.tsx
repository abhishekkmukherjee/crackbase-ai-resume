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
  title: "CrackBase Resume AI - AI-Powered Resume Builder",
  description: "Create professional resumes with AI assistance. Perfect for students and freshers. Generate, preview, and download your resume for just ₹49.",
  keywords: "resume builder, AI resume, job application, career, students, freshers",
  authors: [{ name: "CrackBase" }],
  openGraph: {
    title: "CrackBase Resume AI",
    description: "AI-Powered Resume Builder for Students and Freshers",
    type: "website",
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
