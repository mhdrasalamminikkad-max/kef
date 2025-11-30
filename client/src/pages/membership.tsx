import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  Building2,
  TrendingUp,
  Award,
  CheckCircle2,
  Briefcase,
  CheckCircle,
  Sparkles,
  UserPlus,
  Rocket,
  ArrowRight
} from "lucide-react";
import qrCodeImage from "@assets/qrm_1764493231811.png";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const membershipBenefits = [
  "Access to all events",
  "Mentorship & advisory",
  "Funding support",
  "Networking circles",
  "Startup resources",
  "Campus opportunities",
  "Recognition badges"
];

const membershipTypes = [
  {
    icon: Briefcase,
    title: "Entrepreneur Membership",
    description: "For startup founders, business owners, and aspiring entrepreneurs looking to connect, learn, and grow within Kerala's entrepreneurial ecosystem.",
    gradient: "red"
  },
  {
    icon: GraduationCap,
    title: "Student Membership",
    description: "For students passionate about entrepreneurship, looking for mentorship, networking, and opportunities to start their entrepreneurial journey.",
    gradient: "cyan"
  },
  {
    icon: Building2,
    title: "Business Membership",
    description: "For established businesses wanting to connect with startups, support the ecosystem, and find collaboration opportunities.",
    gradient: "yellow"
  },
  {
    icon: TrendingUp,
    title: "Investor Membership",
    description: "For angel investors, VCs, and investment professionals looking to discover and support promising startups in Kerala.",
    gradient: "red"
  },
  {
    icon: Award,
    title: "Institutional Membership",
    description: "For colleges, universities, incubators, and organizations wanting to partner with KEF for campus programs and ecosystem building.",
    gradient: "cyan"
  }
];

export default function Membership() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    institutionName: "",
    phoneNumber: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.place && formData.institutionName && formData.phoneNumber) {
      setIsRegistered(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* HERO - Glassmorphism */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rotate-45" />
          <div className="absolute bottom-20 left-10 w-16 h-16 border border-white/10 rotate-12" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="glass-panel text-white border-white/20 mb-6 py-1.5 px-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Join the Movement
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4 hero-text-shadow"
            data-testid="text-membership-title"
          >
            Become a Member of Kerala Economic Forum
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
            data-testid="text-membership-subtitle"
          >
            Join the movement and become part of Kerala's most vibrant entrepreneurial network.
          </motion.p>
        </div>
      </section>

      {/* MEMBERSHIP BENEFITS */}
      <Section>
        <SectionHeader title="Membership Benefits" />
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {membershipBenefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate overflow-visible">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rotate-45 bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 -rotate-45" />
                    </div>
                    <span className="text-foreground font-medium" data-testid={`text-benefit-${index}`}>{benefit}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* MEMBERSHIP TYPES */}
      <Section background="muted">
        <SectionHeader title="Membership Types" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate overflow-visible">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rotate-45 flex items-center justify-center mb-4 ${
                    type.gradient === 'red' ? 'bg-red-500' :
                    type.gradient === 'yellow' ? 'bg-yellow-400' :
                    'bg-cyan-500'
                  }`}>
                    <type.icon className={`w-7 h-7 -rotate-45 ${type.gradient === 'yellow' ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-3" data-testid={`text-type-title-${index}`}>
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-type-desc-${index}`}>
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* MEMBERSHIP REGISTRATION FORM */}
      <Section>
        <SectionHeader title="Register Now" />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {isRegistered ? (
              <Card className="overflow-visible">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <div className="w-24 h-24 mx-auto rotate-45 bg-cyan-500 flex items-center justify-center mb-6">
                      <CheckCircle className="w-12 h-12 text-white -rotate-45" />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-success-title">
                    You have registered successfully!
                  </h2>
                  <p className="text-muted-foreground mb-6" data-testid="text-success-message">
                    Thank you for registering with Kerala Economic Forum. We will contact you soon.
                  </p>
                  <Button 
                    onClick={() => {
                      setIsRegistered(false);
                      setFormData({ name: "", place: "", institutionName: "", phoneNumber: "" });
                    }}
                    className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold"
                    data-testid="button-register-another"
                  >
                    Register Another
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-visible">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input 
                          id="name" 
                          placeholder="Your full name" 
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          data-testid="input-name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="place">Place *</Label>
                        <Input 
                          id="place" 
                          placeholder="Your city/town" 
                          value={formData.place}
                          onChange={(e) => handleInputChange("place", e.target.value)}
                          required
                          data-testid="input-place" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institutionName">Institution Name *</Label>
                        <Input 
                          id="institutionName" 
                          placeholder="Your college/company name" 
                          value={formData.institutionName}
                          onChange={(e) => handleInputChange("institutionName", e.target.value)}
                          required
                          data-testid="input-institution" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input 
                          id="phoneNumber" 
                          placeholder="+91 XXXXX XXXXX" 
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          required
                          data-testid="input-phone" 
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold" 
                        data-testid="button-submit-registration"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Complete Registration
                      </Button>
                    </form>

                    {/* UPI QR Code Section */}
                    <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl">
                      <h3 className="font-semibold text-lg text-foreground mb-4" data-testid="text-payment-title">
                        Payment via UPI
                      </h3>
                      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                        <img 
                          src={qrCodeImage} 
                          alt="UPI Payment QR Code" 
                          className="w-48 h-48"
                          data-testid="img-upi-qr"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center" data-testid="text-upi-id">
                        Scan to pay membership fee
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </Section>

      {/* STARTUP BOOT CAMP CTA */}
      <Section background="muted">
        <SectionHeader title="Startup Boot Camp" />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 rotate-45 bg-yellow-400 flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-black -rotate-45" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-bootcamp-cta">
                  Startup Boot Camp - December 26-28, 2025
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-bootcamp-cta-desc">
                  A 3-day residential experience for ages 15-29 at Caliph Life School, Kozhikode. Transform your ideas into real startups with expert mentorship and hands-on workshops.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
