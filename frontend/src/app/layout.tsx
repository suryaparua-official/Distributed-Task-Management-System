import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A production-ready task management application",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f0f] text-white">
        <AppProvider>
          <Toaster position="top-right" />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
