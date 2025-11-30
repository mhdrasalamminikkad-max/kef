import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreakingNews } from "@/components/breaking-news";
import { BootcampModal } from "@/components/bootcamp-modal";
import { MobileNav } from "@/components/mobile-nav";
import { FloatingInvitationButton } from "@/components/floating-invitation-button";
import { FloatingInvitationsIcon } from "@/components/floating-invitations-icon";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="pt-14 md:pt-16 lg:pt-20">
        <BreakingNews />
      </div>
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
      <BootcampModal />
      <FloatingInvitationButton />
      <FloatingInvitationsIcon />
    </div>
  );
}
