"use client";
import Footer from "@/components/shared/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="">
      <main>{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
