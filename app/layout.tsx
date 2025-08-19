export const metadata = {
  title: "Covercons",
  description: "Generate beautiful Notion covers",
};

import "../styles/globals.css";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#222222" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
