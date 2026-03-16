import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { getEscuelaCategories } from "config/escuelajs";
import "./globals.css";
import "@/shared/styles/styles.scss";
import Header from "@/shared/components/Header";
import { StoreProvider } from "@/providers/StoreProvider";
import { ToastProvider } from "./ToastProvider";

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

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialCategories: Awaited<ReturnType<typeof getEscuelaCategories>> = [];
  try {
    initialCategories = await getEscuelaCategories();
  } catch {
    initialCategories = [];
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable} suppressHydrationWarning>
        <StoreProvider initialCategories={initialCategories}>
          <div className="app">
            <header>
              <Header />
            </header>
            {children}
          </div>
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
