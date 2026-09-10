import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./styles.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "WorldSkills India - Smart Checklist",
  authors: [{ name: "Mausam Giri", url: "https://mausamgiri.in" }],
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${roboto.className} ws-root`}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      {children}
    </div>
  );
}
