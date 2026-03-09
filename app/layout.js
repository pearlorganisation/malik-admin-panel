import Providers from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>

          <LayoutWrapper>
            {children}
          </LayoutWrapper>

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: { fontSize: "14px" },
            }}
          />

        </Providers>
      </body>
    </html>
  );
}