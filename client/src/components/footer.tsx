import { Link } from "wouter";
import { 
  Instagram, 
  Facebook,
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  pages: [
    { label: "Home", href: "/" },
    { label: "Programs", href: "/programs" },
    { label: "Membership", href: "/membership" },
    { label: "Partners", href: "/partners" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  policies: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/kerala.economic.forum?igsh=MThoMXFqdXEzdnM2cA==", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/share/17kPGZQci3/?mibextid=wwXIfr", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute inset-0 geometric-dots opacity-30" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rotate-45 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rotate-45 translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="KEF Logo" className="w-10 h-10 rounded-lg" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-white">
                  Kerala Economic Forum
                </span>
                <span className="text-xs text-slate-400 leading-tight">
                  Empowering Entrepreneurs
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm">
              A statewide non-profit movement empowering entrepreneurs, startups, students, 
              institutions, and innovators to build, grow, and transform Kerala's economic future.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rotate-45 bg-cyan-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-cyan-400 -rotate-45" />
                </div>
                <span>keralaeconomicforum.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rotate-45 bg-cyan-500/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-cyan-400 -rotate-45" />
                </div>
                <span>+91 9072344431</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rotate-45 bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-cyan-400 -rotate-45" />
                </div>
                <span>Level 3, Venture Arcade, Mavoor Rd, above Croma, Thondayad, Kozhikode, Kerala 673016</span>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rotate-45 bg-slate-800 hover:bg-red-500 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4 -rotate-45" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Pages</h3>
            <ul className="space-y-2">
              {footerLinks.pages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-yellow-300 cursor-pointer transition-colors flex items-center gap-2 group" data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.policies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-yellow-300 cursor-pointer transition-colors flex items-center gap-2 group" data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="font-semibold text-white mb-4 mt-6">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/kerala.economic.forum?igsh=MThoMXFqdXEzdnM2cA==" className="text-sm text-slate-400 hover:text-yellow-300 transition-colors flex items-center gap-2 group" target="_blank" rel="noopener noreferrer">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/17kPGZQci3/?mibextid=wwXIfr" className="text-sm text-slate-400 hover:text-yellow-300 transition-colors flex items-center gap-2 group" target="_blank" rel="noopener noreferrer">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Facebook
                </a>
              </li>
            </ul>
            
            <div className="mt-6">
              <Link href="/membership">
                <Button className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold text-sm" data-testid="footer-join-button">
                  Join the Forum
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Kerala Economic Forum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
