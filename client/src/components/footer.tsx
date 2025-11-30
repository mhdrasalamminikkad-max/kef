import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Our Vision", href: "/about#vision" },
    { label: "Partners", href: "/partners" },
  ],
  programs: [
    { label: "All Programs", href: "/programs" },
    { label: "Startup Support", href: "/startup-support" },
    { label: "Campus Initiatives", href: "/campus-initiatives" },
    { label: "Events", href: "/events" },
  ],
  resources: [
    { label: "Resources", href: "/resources" },
    { label: "Membership", href: "/membership" },
    { label: "Contact Us", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
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
              Kerala Economic Forum (KEF) is a dynamic platform dedicated to fostering 
              entrepreneurship, supporting startups, and driving sustainable economic 
              growth across Kerala.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>info@keralaeconomicforum.org</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>+91 471 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Thiruvananthapuram, Kerala, India</span>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Programs</h3>
            <ul className="space-y-2">
              {footerLinks.programs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                data-testid="input-newsletter-email"
              />
              <Button size="icon" data-testid="button-newsletter-submit">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Kerala Economic Forum. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
