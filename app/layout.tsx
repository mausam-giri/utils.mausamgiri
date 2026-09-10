import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coming Soon | Mausam Giri",
  authors: [{ name: "Mausam Giri", url: "https://mausamgiri.in" }],
  icons: { icon: "https://mausamgiri.in/favicon.ico" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
