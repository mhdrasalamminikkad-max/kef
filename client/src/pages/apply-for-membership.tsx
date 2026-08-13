import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2,
  CheckCircle,
  Sparkles,
  UserPlus,
  Loader2,
  Upload,
  X,
  IndianRupee,
  CreditCard,
  Copy
} from "lucide-react";
import qrCodeImage from "@assets/IMG_3535_1764520833105_1764610343427_1765297402185.png";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const membershipPricing: Record<string, { normal: number; special: number }> = {
  student: { normal: 1500, special: 750 },
  individual: { normal: 3000, special: 1500 },
  corporate: { normal: 10000, special: 5000 },
  institutional: { normal: 7500, special: 3750 },
};

const membershipTypeOptions = [
  { value: "student", label: "Student (₹750)" },
  { value: "individual", label: "Entrepreneur / Individual (₹1,500)" },
  { value: "corporate", label: "Business / Corporate (₹5,000)" },
  { value: "institutional", label: "Institution / Organization (₹3,750)" },
];

const interestOptions = [
  "Technology & Innovation",
  "Startup Ecosystem",
  "International Trade",
  "Supply Chain",
  "Education",
  "Manufacturing",
  "Healthcare",
  "Agriculture",
  "Finance & Banking",
  "Policy & Governance",
  "Other",
];

const upiApps = [
  { id: "gpay", name: "Google Pay", scheme: "googleplay" },
  { id: "phonepe", name: "PhonePe", scheme: "phonepe" },
  { id: "paytm", name: "Paytm", scheme: "paytmqr" },
  { id: "bhim", name: "BHIM", scheme: "bhim" },
];

const UPI_ID = "pos.5346277@indus";

export function ApplyForMembership() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

  const priceData = formData.membershipType ? membershipPricing[formData.membershipType] : null;
  const currentPrice = priceData?.special || 0;
  const normalPrice = priceData?.normal || 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        paymentScreenshot: reader.result as string
      }));
      setUploadedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, paymentScreenshot: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const openUpiApp = (scheme: string, appName: string) => {
    const upiString = `upi://pay?pa=caliphworldfoundation.9605399676.ibz@icici&pn=KEF&am=${currentPrice}&tr=KEF-${Date.now()}&tn=KEF%20Membership`;
    window.location.href = upiString;
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/membership", formData);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({ title: "Success", description: "Application submitted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.utrNumber || !formData.paymentScreenshot) {
      toast({ title: "Required Fields Missing", description: "Please enter UTR number and upload payment screenshot" });
      return;
    }

    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <Section>
        <SectionHeader 
          title="Apply for Membership" 
          subtitle="Join Kerala Economic Forum and unlock exclusive benefits"
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
                      <p className="text-sm text-muted-foreground mb-6">Pay using UPI ID or QR Code</p>
                      
                      <div className="flex flex-col items-center gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border text-center">
                          <p className="text-sm font-semibold text-foreground mb-3">Scan QR Code to Pay</p>
                          <img 
                            src={qrCodeImage} 
                            alt="Payment QR Code" 
                            className="w-48 h-48 mx-auto rounded-lg border"
                            data-testid="img-qr-code-success"
                          />
                          <p className="text-xs text-muted-foreground mt-2">Scan with any UPI app</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800 text-left max-w-sm">
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Or Pay Using UPI ID:</p>
                          <p className="text-sm font-mono font-semibold break-all mb-4">{UPI_ID}</p>
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
                        
                        <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-lg p-6 mb-4 border border-red-200 dark:border-red-800">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Normal Price:</span>
                              <span className="text-lg line-through text-muted-foreground">
                                ₹{normalPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-red-200 dark:border-red-800">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">KEF Special Offer:</p>
                                <div className="inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                  Limited Time Offer!
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-6 h-6 text-green-600" />
                                <span className="text-3xl font-bold text-green-600" data-testid="text-membership-price">
                                  {currentPrice.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-green-600 font-semibold pt-2">
                              You Save: ₹{(normalPrice - currentPrice).toLocaleString('en-IN')} ({Math.round((normalPrice - currentPrice) / normalPrice * 100)}% OFF)
                            </p>
                          </div>
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

                        {/* UPI ID Direct Payment */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">Pay Using UPI ID:</p>
                          <div className="text-sm space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2 justify-center p-2 bg-white dark:bg-slate-800 rounded border">
                              <p className="font-mono font-semibold text-foreground text-base">{UPI_ID}</p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => copyToClipboard(UPI_ID, "UPI ID")}
                                data-testid="button-copy-upi"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-center">Enter UPI ID in your payment app</p>
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
    </div>
  );
}
