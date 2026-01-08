import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Sparkles, 
  UserPlus, 
  Loader2, 
  Upload, 
  X, 
  IndianRupee, 
  CreditCard, 
  Copy, 
  Smartphone 
} from "lucide-react";
import qrCodeImage from "@assets/image_1767872637566.png";
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

const membershipPricing: Record<string, { original: number; discounted: number }> = {
  student: { original: 1500, discounted: 750 },
  individual: { original: 3000, discounted: 1500 },
  corporate: { original: 10000, discounted: 5000 },
  institutional: { original: 7500, discounted: 3750 },
};

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

export default function MembershipApply() {
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
    const amount = currentPrice.discounted.toFixed(2);
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

  const currentPrice = formData.membershipType ? membershipPricing[formData.membershipType] : { original: 0, discounted: 0 };

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
      const price = membershipPricing[value]?.discounted || 0;
      setFormData(prev => ({ ...prev, [field]: value, paymentAmount: price.toString() }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[300px] flex items-center">
        <div className="absolute inset-0 hero-gradient-animated" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        <Floating3DShapes />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="glass-panel text-white border-white/20 mb-6 py-1.5 px-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Join Kerala Economic Forum
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4 hero-text-shadow"
          >
            Membership Application
          </motion.h1>
        </div>
      </section>

      <Section>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible shadow-xl border-primary/10">
              <CardContent className="p-6 sm:p-8">
                {isSubmitted ? (
                  <div className="space-y-8 text-center py-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Application Submitted!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your interest. We'll review your application and contact you soon.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800 text-left max-w-sm mx-auto">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Payment Status:</p>
                      <p className="text-sm text-muted-foreground mb-4">Your payment of ₹{formData.paymentAmount} is being verified.</p>
                      <div className="text-xs space-y-2 text-muted-foreground border-t pt-4">
                        <p className="font-semibold text-foreground">Transaction ID:</p>
                        <p className="font-mono">{formData.utrNumber}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)} className="w-full mt-8">
                      Submit Another Application
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="membershipType">Membership Type *</Label>
                        <Select
                          value={formData.membershipType}
                          onValueChange={(value) => handleInputChange("membershipType", value)}
                        >
                          <SelectTrigger>
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation / Role</Label>
                        <Input
                          id="designation"
                          placeholder="Your role or position"
                          value={formData.designation}
                          onChange={(e) => handleInputChange("designation", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">Areas of Interest *</Label>
                      <Select
                        value={formData.interests}
                        onValueChange={(value) => handleInputChange("interests", value)}
                      >
                        <SelectTrigger>
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
                        placeholder="Tell us more about yourself..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={3}
                      />
                    </div>

                    {formData.membershipType && (
                      <div className="border-t pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">Payment Details</h3>
                        </div>
                        
                        <div className="bg-muted/50 rounded-xl p-4 sm:p-6 mb-6">
                          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <div className="text-center sm:text-left">
                              <p className="text-sm text-muted-foreground mb-1">Membership Fee</p>
                              <div className="flex flex-col">
                                <span className="text-sm line-through text-muted-foreground">
                                  ₹{currentPrice.original.toLocaleString("en-IN")}
                                </span>
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="w-6 h-6 text-primary font-bold" />
                                  <span className="text-3xl font-bold text-foreground">
                                    {currentPrice.discounted.toLocaleString("en-IN")}
                                  </span>
                                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                    50% OFF
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm border">
                              <img src={qrCodeImage} alt="KEF QR" className="w-24 h-24 object-contain" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-background rounded-lg border group relative overflow-hidden">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">UPI ID</span>
                              <button type="button" onClick={() => copyToClipboard(UPI_ID, "UPI ID")} className="absolute right-2 top-2 p-1 hover:bg-muted rounded">
                                <Copy className="w-3.5 h-3.5 text-primary" />
                              </button>
                              <p className="text-sm font-mono font-semibold break-all">{UPI_ID}</p>
                            </div>
                            <div className="p-3 bg-background rounded-lg border relative overflow-hidden">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">Payee Name</span>
                              <p className="text-sm font-semibold truncate">{PAYEE_NAME}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase text-center tracking-widest">Open in UPI App</p>
                            <div className="flex flex-wrap justify-center gap-2">
                              {upiApps.map((app) => (
                                <Button
                                  key={app.id}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-4 rounded-full"
                                  onClick={() => openUpiApp(app.scheme, app.name)}
                                >
                                  <Smartphone className="w-3.5 h-3.5 mr-2" />
                                  {app.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <Label htmlFor="utrNumber">UTR / Transaction ID *</Label>
                            <Input
                              id="utrNumber"
                              placeholder="12-digit UTR number"
                              value={formData.utrNumber}
                              onChange={(e) => handleInputChange("utrNumber", e.target.value)}
                              required
                              className="font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paymentScreenshot">Screenshot *</Label>
                            <div className="relative">
                              <input
                                ref={fileInputRef}
                                type="file"
                                id="paymentScreenshot"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              {formData.paymentScreenshot ? (
                                <div className="relative border rounded-md p-1 bg-muted/50">
                                  <img src={formData.paymentScreenshot} alt="Preview" className="h-9 w-full object-contain rounded" />
                                  <Button type="button" variant="destructive" size="icon" className="h-5 w-5 absolute -top-2 -right-2 rounded-full" onClick={clearFile}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg font-semibold"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</>
                      ) : (
                        <><UserPlus className="w-5 h-5 mr-2" />Submit Application</>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
