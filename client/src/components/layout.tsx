import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { BreakingNews } from "@/components/breaking-news";
import { BootcampModal } from "@/components/bootcamp-modal";
import { useQuery } from "@tanstack/react-query";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Check if breaking news is enabled to adjust header offset
  const { data: bnSettings } = useQuery<{ isEnabled: boolean }>({
    queryKey: ["/api/breaking-news-settings"],
    staleTime: 1000 * 60 * 5,
  });
  const tickerVisible = bnSettings?.isEnabled ?? false;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breaking news bar — fixed at very top, above header */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <BreakingNews />
      </div>

      {/* Header pushed down by ticker height when visible */}
      <div
        className="fixed left-0 right-0 z-50"
        style={{ top: tickerVisible ? "36px" : "0px" }}
      >
        <Header />
      </div>

      {/* Spacer: ticker (36px when visible) + header (56px/64px/80px) */}
      <div
        style={{
          paddingTop: tickerVisible
            ? "calc(36px + 3.5rem)"
            : "3.5rem",
        }}
        className="md:pt-0"
      />
      <div className="hidden md:block"
        style={{
          paddingTop: tickerVisible
            ? "calc(36px + 4rem)"
            : "4rem",
        }}
      />

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
      <BootcampModal />
    </div>
  );
}

