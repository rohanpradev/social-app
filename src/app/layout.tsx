import type { Metadata } from "next";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";

export const metadata: Metadata = {
  title: {
    template: "%s | bugbook",
    default: "bugbook",
  },
  description: "The social media app for powernerds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark bg-background text-foreground">
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
