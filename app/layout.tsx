import type { Metadata } from "next";

import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Mitch | Roots, Rhythm, and Booking",
  description: "Premium reggae and roots music bookings and merchandise.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
