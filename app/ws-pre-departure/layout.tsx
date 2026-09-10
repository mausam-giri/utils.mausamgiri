import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./styles.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <div className={`${dmSans.className} ws-root`}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      {children}
    </div>
  );
}
