import { Link } from "wouter";
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin
} from "lucide-react";

const footerLinks = {
  pages: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Membership", href: "/membership" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
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
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>inquiry@keralaeconomicforum.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span>Level 3, Venture Arcade, Mavoor Rd, above Croma, Thondayad, Kozhikode, Kerala 673016</span>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-500 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" />
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
                    <span className="text-sm text-slate-400 hover:text-yellow-300 cursor-pointer transition-colors" data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-yellow-300 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-yellow-300 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-yellow-300 transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
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
