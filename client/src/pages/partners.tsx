import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building2, 
  Handshake,
  ArrowRight
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Partners() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-500 to-cyan-400 opacity-95" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4"
            data-testid="text-partners-title"
          >
            Our Partners
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
            data-testid="text-partners-subtitle"
          >
            We collaborate with organisations that believe in building Kerala's entrepreneurial future.
          </motion.p>
        </div>
      </section>

      {/* PARTNERS LOGOS */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-12">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-500 to-cyan-400 flex items-center justify-center mb-6">
                  <Handshake className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-partners-cta-title">
                  Partner With Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto" data-testid="text-partners-cta-desc">
                  We collaborate with institutions, corporates, incubators, accelerators, and industry leaders to build Kerala's entrepreneurial ecosystem.
                </p>
                <Link href="/contact">
                  <Button size="lg" className="bg-yellow-300 text-black hover:bg-yellow-400 border-yellow-400" data-testid="button-become-partner">
                    Become a Partner
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
