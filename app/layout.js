import Providers from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar.jsx";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel layout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar always visible */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 bg-slate-100 p-6">
              {children}
            </main>
          </div>
        </Providers>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
