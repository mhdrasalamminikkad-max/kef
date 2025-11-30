import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Membership", href: "/membership" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (href: string) => location === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.png" alt="KEF Logo" className="w-10 h-10 rounded-lg" />
              <span className="font-bold text-sm leading-tight text-red-500 hidden sm:block">
                Kerala Economic Forum
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                    isActive(item.href) 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/membership" className="hidden sm:block">
              <Button className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold" data-testid="button-join-now">
                <UserPlus className="w-4 h-4 mr-2" />
                Join Now
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium cursor-pointer transition-colors rounded-md ${
                      isActive(item.href) 
                        ? "text-primary bg-primary/5" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              <div className="pt-2">
                <Link href="/membership">
                  <Button className="w-full btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold" onClick={() => setIsOpen(false)} data-testid="mobile-button-join">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Now
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
