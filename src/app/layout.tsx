import type { Metadata } from "next";
import { Heebo, Rubik } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IsraBis - השוו מחירים, בשלו חכם, חסכו כסף",
  description:
    "השוו מחירים בין 33 רשתות שיווק בישראל, בנו עגלות קניות חכמות, גלו מתכונים מדהימים וחסכו עד 1,000 שקלים בחודש. IsraBis - האפליקציה שמשנה את הדרך שלכם לקנות.",
  keywords: [
    "השוואת מחירים",
    "סופר",
    "חיסכון",
    "קניות",
    "מתכונים",
    "ישראל",
    "IsraBis",
  ],
  openGraph: {
    title: "IsraBis - השוו מחירים, בשלו חכם, חסכו כסף",
    description:
      "השוו מחירים בין 33 רשתות, בנו עגלה חכמה, וגלו מתכונים מדהימים — הכל באפליקציה אחת.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${rubik.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen"
        style={{ fontFamily: "var(--font-heebo), system-ui, sans-serif" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
