import { useState, useRef } from "react";
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
  ArrowRight,
  Loader2,
  Upload,
  X,
  IndianRupee,
  CreditCard,
  Copy,
  Smartphone
} from "lucide-react";
import qrCodeImage from "@assets/IMG_3535_1764520833105_1764610343427_1765297402185.png";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Floating3DShapes } from "@/components/animations";

const membershipPricing: Record<string, number> = {
  student: 999,
  individual: 4999,
  corporate: 9999,
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

const upiApps = [
  { id: "gpay", name: "Google Pay", color: "bg-blue-500", scheme: "gpay://upi/pay" },
  { id: "paytm", name: "Paytm", color: "bg-sky-500", scheme: "paytmmp://pay" },
  { id: "bhim", name: "BHIM UPI", color: "bg-green-600", scheme: "upi://pay" },
  { id: "amazonpay", name: "Amazon Pay", color: "bg-orange-500", scheme: "upi://pay" },
  { id: "other", name: "Other UPI", color: "bg-gray-600", scheme: "upi://pay" },
];

const UPI_ID = "caliphworldfoundation.9605399676.ibz@icici";
const PAYEE_NAME = "Kerala Economic Forum";

export default function Membership() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    membershipType: "",
    interests: "",
    message: "",
    paymentAmount: "",
    paymentScreenshot: "",
    utrNumber: "",
    payerUpiId: "",
    paymentDate: ""
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image (JPEG, PNG, GIF, WebP).",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      const base64 = await convertFileToBase64(file);
      setFormData(prev => ({ ...prev, paymentScreenshot: base64 }));
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, paymentScreenshot: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const openUpiApp = (appScheme: string, appName: string) => {
    const amount = currentPrice.toFixed(2);
    const txnId = `KEF${Date.now()}`;
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: amount,
      cu: "INR",
      tr: txnId,
      tn: `KEF Membership - ${formData.membershipType}`
    });
    
    const deepLink = `${appScheme}?${params.toString()}`;
    window.location.href = deepLink;
    
    toast({
      title: `Opening ${appName}`,
      description: "Complete payment in the app, then upload screenshot here",
    });
  };

  const currentPrice = formData.membershipType ? membershipPricing[formData.membershipType] : 0;

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/membership", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

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
    if (!formData.utrNumber || formData.utrNumber.length < 6) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter a valid UTR/Transaction ID from your payment.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.paymentScreenshot) {
      toast({
        title: "Payment Screenshot Required",
        description: "Please upload your payment screenshot.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
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
                        setUploadedFile(null);
                        setFormData({
                          fullName: "",
                          email: "",
                          phone: "",
                          organization: "",
                          designation: "",
                          membershipType: "",
                          interests: "",
                          message: "",
                          paymentAmount: "",
                          paymentScreenshot: "",
                          utrNumber: "",
                          payerUpiId: "",
                          paymentDate: ""
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

                        {/* QR Code Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border text-center">
                          <p className="text-sm font-semibold text-foreground mb-3">Scan QR Code to Pay</p>
                          <img 
                            src={qrCodeImage} 
                            alt="Payment QR Code" 
                            className="w-48 h-48 mx-auto rounded-lg border"
                            data-testid="img-qr-code"
                          />
                          <p className="text-xs text-muted-foreground mt-2">Scan with any UPI app</p>
                        </div>

                        {/* UPI Apps Selection */}
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-foreground">Or Pay Using UPI App:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {upiApps.map((app) => (
                              <Button
                                key={app.id}
                                type="button"
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => openUpiApp(app.scheme, app.name)}
                                data-testid={`button-upi-${app.id}`}
                              >
                                <Smartphone className="w-4 h-4" />
                                <span className="text-xs">{app.name}</span>
                              </Button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            Click to open app with payment details pre-filled
                          </p>
                        </div>

                        {/* Bank Transfer Details */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">Or Pay via Bank Transfer:</p>
                          <div className="text-xs space-y-1 text-muted-foreground">
                            <p className="font-medium text-foreground">CALIPH WORLD FOUNDATION</p>
                            <p>ICICI BANK - MUKKAM BRANCH</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p>A/C: 265405000474</p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard("265405000474", "Account Number")}
                                data-testid="button-copy-account"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p>IFSC: ICIC0002654</p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard("ICIC0002654", "IFSC Code")}
                                data-testid="button-copy-ifsc"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Verification Warning */}
                        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                            Payment Verification Notice
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-500">
                            All payments are verified against bank records. Fake or manipulated screenshots will result in immediate rejection and permanent blacklisting.
                          </p>
                        </div>

                        {/* Payment Details - Required for Verification */}
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="utrNumber" className="flex items-center gap-1">
                              UTR / Transaction ID *
                              <span className="text-xs text-red-500">(Required)</span>
                            </Label>
                            <Input
                              id="utrNumber"
                              placeholder="Enter 12-digit UTR number from payment"
                              value={formData.utrNumber}
                              onChange={(e) => handleInputChange("utrNumber", e.target.value)}
                              required
                              data-testid="input-utr-number"
                            />
                            <p className="text-xs text-muted-foreground">
                              Find this in your payment app under transaction details or SMS from bank
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="payerUpiId">Your UPI ID</Label>
                              <Input
                                id="payerUpiId"
                                placeholder="yourname@upi"
                                value={formData.payerUpiId}
                                onChange={(e) => handleInputChange("payerUpiId", e.target.value)}
                                data-testid="input-payer-upi"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="paymentDate">Payment Date</Label>
                              <Input
                                id="paymentDate"
                                type="date"
                                value={formData.paymentDate}
                                onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                                data-testid="input-payment-date"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Payment Screenshot Upload - Required */}
                        <div className="space-y-2">
                          <Label htmlFor="paymentScreenshot" className="flex items-center gap-1">
                            Payment Screenshot *
                            <span className="text-xs text-red-500">(Required)</span>
                          </Label>
                          <div className="border-2 border-dashed rounded-lg p-4 transition-colors hover:border-primary/50">
                            <input
                              ref={fileInputRef}
                              type="file"
                              id="paymentScreenshot"
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              onChange={handleFileChange}
                              className="hidden"
                              data-testid="input-payment-screenshot"
                            />
                            
                            {formData.paymentScreenshot ? (
                              <div className="space-y-3">
                                <div className="relative">
                                  <img 
                                    src={formData.paymentScreenshot} 
                                    alt="Payment Screenshot" 
                                    className="max-h-48 mx-auto rounded-lg object-contain"
                                    data-testid="img-payment-screenshot-preview"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={clearFile}
                                    data-testid="button-clear-screenshot"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-center text-muted-foreground">
                                  {uploadedFile?.name}
                                </p>
                              </div>
                            ) : (
                              <div 
                                className="flex flex-col items-center gap-2 py-4 cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="w-8 h-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground text-center">
                                  Click to upload payment screenshot
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  JPG, PNG, GIF, WebP (Max 5MB)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-6"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-membership"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Submit Application
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
