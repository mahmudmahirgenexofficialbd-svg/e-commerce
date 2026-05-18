import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hindSiliguri = Hind_Siliguri({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["bengali", "latin"],
  variable: "--font-hind"
});

export const metadata: Metadata = {
  title: "Antigravity | Premium E-Commerce Platform",
  description: "The ultimate shopping experience in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
