import { Link, useLocation } from "wouter";
import { Home, Info, Layers, Users, Phone, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: Info },
  { label: "Programs", href: "/programs", icon: Layers },
  { label: "Join", href: "/membership", icon: Users },
  { label: "Contact", href: "/contact", icon: Phone },
];

export function MobileNav() {
  const [location] = useLocation();

  const isActive = (href: string) => location === href;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[60px] cursor-pointer transition-all duration-200 ${
                  active 
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
                    : "text-muted-foreground"
                }`}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-white" : ""}`} />
                <span className={`text-[10px] mt-1 font-medium ${active ? "text-white" : ""}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
