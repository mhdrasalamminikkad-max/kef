import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreakingNews } from "@/components/breaking-news";
import { BootcampModal } from "@/components/bootcamp-modal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="pt-16 lg:pt-20">
        <BreakingNews />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BootcampModal />
    </div>
  );
}
