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
  title: "S3 Data Explorer",
  description: "Explore satellite data from S3",
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
        <div className="min-h-screen bg-background text-white pt-4">

          <nav className="bg-nav mx-auto w-[80%] sm:w-[70%] md:max-w-[50%] rounded-[100px] border border-gray-700">
            <div className="px-6 sm:px-8 py-4">
              <div className="flex justify-center items-center">
                <h1 className="text-xl sm:text-4xl font-semibold text-white">
                  the satellite company
                </h1>
              </div>
            </div>
          </nav>

          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
