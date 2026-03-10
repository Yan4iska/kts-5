import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "@/shared/styles/styles.scss";
import Header from "@/shared/components/Header";
import { StoreProvider } from "@/providers/StoreProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lalasia",
  description: "E-commerce store – browse products and categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <StoreProvider>
          <div className="app">
            <header>
              <Header />
            </header>
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
