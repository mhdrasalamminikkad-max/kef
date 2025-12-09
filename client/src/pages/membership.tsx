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
  Loader2,
  IndianRupee,
  CreditCard
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Floating3DShapes } from "@/components/animations";

const membershipPricing: Record<string, number> = {
  student: 999,
  individual: 9999,
  corporate: 19999,
  institutional: 9999,
};

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

const membershipTypeOptions = [
  { value: "individual", label: "Entrepreneur / Individual" },
  { value: "student", label: "Student" },
  { value: "corporate", label: "Business / Corporate" },
  { value: "institutional", label: "Institution / Organization" },
];

const interestOptions = [
  "Networking & Events",
  "Mentorship",
  "Funding Support",
  "Startup Resources",
  "Campus Programs",
  "Business Partnerships",
  "Investment Opportunities",
];

export default function Membership() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    membershipType: "",
    interests: "",
    message: "",
    paymentAmount: ""
  });

  const currentPrice = formData.membershipType ? membershipPricing[formData.membershipType] : 0;

  const initiatePhonePePayment = async () => {
    try {
      setIsPaymentProcessing(true);
      
      // Store membership data in sessionStorage for after payment
      sessionStorage.setItem('pendingMembership', JSON.stringify(formData));
      sessionStorage.setItem('membershipFlow', 'true');
      
      const response = await fetch('/api/phonepe/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentPrice,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.paymentUrl) {
        sessionStorage.setItem('merchantTransactionId', result.merchantTransactionId);
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.error || 'Failed to initiate payment');
      }
    } catch (error: any) {
      setIsPaymentProcessing(false);
      toast({
        title: "Payment Initiation Failed",
        description: error.message || "Could not start payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.membershipType || !formData.interests) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    // Initiate PhonePe payment
    initiatePhonePePayment();
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "membershipType") {
      const price = membershipPricing[value] || 0;
      setFormData(prev => ({ ...prev, [field]: value, paymentAmount: price.toString() }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <>
      {/* HERO - Glassmorphism */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 hero-gradient-animated" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        <Floating3DShapes />
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

      {/* MEMBERSHIP APPLICATION FORM */}
      <Section>
        <SectionHeader 
          title="Apply for Membership" 
          subtitle="Fill out the form below to join Kerala Economic Forum"
        />
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-6 sm:p-8">
                {isSubmitted ? (
                  <div className="space-y-8">
                    <div className="text-center py-8 border-b pb-8">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-success-title">
                        Application Submitted!
                      </h3>
                      <p className="text-muted-foreground mb-6" data-testid="text-success-message">
                        Thank you for your interest in joining Kerala Economic Forum. We'll review your application and contact you soon.
                      </p>
                    </div>

                    {/* Payment Section */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Complete Membership Payment</h3>
                      <p className="text-sm text-muted-foreground mb-6">Pay using UPI or Bank Transfer</p>
                      
                      <div className="flex flex-col items-center gap-6">
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800 text-left max-w-sm">
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Pay Using:</p>
                          <p className="text-xs text-muted-foreground mb-2">UPI ID:</p>
                          <p className="text-sm font-mono font-semibold break-all mb-4">caliphworldfoundation.9605399676.ibz@icici</p>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Bank Transfer:</p>
                          <div className="text-xs space-y-1 text-muted-foreground">
                            <p>CALIPH WORLD FOUNDATION</p>
                            <p>ICICI BANK - MUKKAM BRANCH</p>
                            <p>A/C: 265405000474</p>
                            <p>IFSC: ICIC0002654</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: "",
                          email: "",
                          phone: "",
                          organization: "",
                          designation: "",
                          membershipType: "",
                          interests: "",
                          message: "",
                          paymentAmount: ""
                        });
                      }}
                      className="w-full"
                      data-testid="button-submit-another"
                    >
                      Submit Another Application
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
                          data-testid="input-fullname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                          data-testid="input-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="membershipType">Membership Type *</Label>
                        <Select
                          value={formData.membershipType}
                          onValueChange={(value) => handleInputChange("membershipType", value)}
                        >
                          <SelectTrigger data-testid="select-membership-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {membershipTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization / Institution</Label>
                        <Input
                          id="organization"
                          placeholder="Company or college name"
                          value={formData.organization}
                          onChange={(e) => handleInputChange("organization", e.target.value)}
                          data-testid="input-organization"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation / Role</Label>
                        <Input
                          id="designation"
                          placeholder="Your role or position"
                          value={formData.designation}
                          onChange={(e) => handleInputChange("designation", e.target.value)}
                          data-testid="input-designation"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">Areas of Interest *</Label>
                      <Select
                        value={formData.interests}
                        onValueChange={(value) => handleInputChange("interests", value)}
                      >
                        <SelectTrigger data-testid="select-interests">
                          <SelectValue placeholder="What are you interested in?" />
                        </SelectTrigger>
                        <SelectContent>
                          {interestOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about yourself or why you want to join..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={4}
                        data-testid="textarea-message"
                      />
                    </div>

                    {formData.membershipType && (
                      <div className="border-t pt-6 mt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">Payment Details</h3>
                        </div>
                        
                        <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-800">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Membership Fee:</span>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-5 h-5 text-green-600" />
                              <span className="text-2xl font-bold text-green-600" data-testid="text-membership-price">
                                {currentPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formData.membershipType === 'student' && 'Student Membership'}
                            {formData.membershipType === 'individual' && 'Entrepreneur / Individual Membership'}
                            {formData.membershipType === 'corporate' && 'Business / Corporate Membership'}
                            {formData.membershipType === 'institutional' && 'Institution / Organization Membership'}
                          </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-muted-foreground text-center">
                            You will be redirected to PhonePe to complete your payment securely.
                          </p>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-6"
                      disabled={isPaymentProcessing || !formData.membershipType}
                      data-testid="button-submit-membership"
                    >
                      {isPaymentProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Redirecting to PhonePe...
                        </>
                      ) : formData.membershipType ? (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay ₹{currentPrice.toLocaleString('en-IN')} with PhonePe
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Select Membership Type
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
