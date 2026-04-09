import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["100", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IsraBis - השוו מחירים, בשלו חכם, חסכו כסף",
  description: "השוו מחירים בין 33 רשתות שיווק בישראל, בנו עגלות קניות חכמות, גלו מתכונים מדהימים וחסכו עד 1,000 שקלים בחודש.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.className} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
