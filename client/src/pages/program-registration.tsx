import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Section } from "@/components/section";
import { ArrowRight, Upload, AlertTriangle, CheckCircle2, Image as ImageIcon, Loader2, QrCode } from "lucide-react";
import type { Program } from "@shared/schema";

interface ProgramRegistrationPageProps {
  programId?: string;
}

export default function ProgramRegistrationPage({ programId }: ProgramRegistrationPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedProgramId, setSelectedProgramId] = useState(programId || "");
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    countryCode: "+91",
    company: "",
    designation: "",
    isMember: false,
    membershipNumber: "",
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Sync selectedProgramId from URL prop if provided
  useEffect(() => {
    if (programId && programId !== selectedProgramId) {
      setSelectedProgramId(programId);
    }
  }, [programId]);

  // Fetch all programs
  const { data: allPrograms } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Include all programs (excluding Head Talks 1.3 which uses external registration)
  const livePrograms = allPrograms?.filter((p: Program) => p.title !== 'Head Talks 1.3') || [];

  // Fetch selected program details
  const programQuery = useQuery({
    queryKey: [`/api/programs/${selectedProgramId}`],
    enabled: !!selectedProgramId,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Payment screenshot must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to upload payment screenshot");
      }

      const result = await res.json();
      setPaymentScreenshot(result.url);
      setPreviewUrl(URL.createObjectURL(file));
      toast({
        title: "Screenshot Uploaded",
        description: "Payment screenshot uploaded successfully!",
      });
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Could not upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData & { paymentScreenshot?: string }) => {
      if (!selectedProgramId) {
        throw new Error("Please select a program");
      }
      const response = await apiRequest("POST", "/api/program-registrations", {
        ...data,
        programId: selectedProgramId,
        paymentScreenshot: paymentScreenshot || undefined,
        status: "pending",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted and is pending verification!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for the program",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) {
      toast({
        title: "Error",
        description: "Please select a program",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(formData);
  };

  const program = programQuery.data as any;

  // Redirect to external registration link for Head Talks 1.3
  useEffect(() => {
    if (program && program.title === 'Head Talks 1.3') {
      window.location.href = 'https://wkf.ms/4a8ALEW';
    }
  }, [program]);

  return (
    <Section className="py-12">
      <div className="max-w-2xl mx-auto">
        {program && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
            <p className="text-muted-foreground">{program.description}</p>
          </div>
        )}

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Register for Program</CardTitle>
            <CardDescription>Please fill in your details and complete the payment step</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Program Selection */}
              <div className="space-y-2">
                <Label htmlFor="program" className="font-semibold">
                  Select Program <span className="text-red-500">*</span>
                </Label>
                <select
                  id="program"
                  value={selectedProgramId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProgramId(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm font-medium focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Choose a live program...</option>
                  {livePrograms.map((prog: Program) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.title} {prog.feeAmount ? `(${prog.feeAmount})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Select the program you want to register for
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  maxLength={255}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used to identify you during the event.
                </p>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  We will use this to send you event updates, gate pass, and notifications.
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFormData({ ...formData, countryCode: e.target.value })
                    }
                    className="px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    <option value="+91">(+91) India</option>
                  </select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Please provide your phone number for event communication.
                </p>
              </div>

              {/* Company / Professional */}
              <div className="space-y-2">
                <Label htmlFor="company" className="font-semibold">Company / Organisation</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company or organisation"
                  value={formData.company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="font-semibold">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  min="1"
                  max="120"
                />
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation" className="font-semibold">Designation</Label>
                <Input
                  id="designation"
                  type="text"
                  placeholder="Your designation/job title"
                  value={formData.designation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>

              {/* KEF Member */}
              <div className="space-y-3">
                <Label className="font-semibold">Are you a KEF Member? <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formData.isMember ? "yes" : "no"}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, isMember: value === "yes" })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="member-yes" />
                    <Label htmlFor="member-yes" className="cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="member-no" />
                    <Label htmlFor="member-no" className="cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Membership Number (Conditional) */}
              {formData.isMember && (
                <div className="space-y-2">
                  <Label htmlFor="membershipNumber" className="font-semibold">Membership Number</Label>
                  <Input
                    id="membershipNumber"
                    type="text"
                    placeholder="Enter your KEF membership number"
                    value={formData.membershipNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, membershipNumber: e.target.value })
                    }
                  />
                </div>
              )}

              {/* PAYMENT DETAILS & QR CODE SECTION */}
              <div className="pt-6 border-t space-y-6">
                <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-xl p-5 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-400">
                    <QrCode className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-bold">Payment Details & QR Code</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    {/* QR Code Container */}
                    <div className="bg-white p-4 rounded-xl shadow-md border flex flex-col items-center justify-center text-center">
                      <img
                        src="/uploads/indusind-qr-code.png"
                        alt="KEF IndusInd Bank Payment QR Code"
                        className="w-52 h-52 object-contain rounded-xl shadow-md border p-2 bg-white"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          // Fallback QR code if asset fails to load
                          (e.target as HTMLImageElement).src = "/attached_assets/indusind-qr-code.png";
                        }}
                      />
                      <span className="text-xs font-semibold mt-2 text-muted-foreground flex items-center gap-1">
                        Scan with GPay, PhonePe, Paytm, Amazon Pay or UPI
                      </span>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-3 text-sm">
                      <div className="bg-white/80 dark:bg-black/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/40">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Account Name</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-base">KERALA ECONOMIC FORUM</p>
                      </div>

                      <div className="bg-white/80 dark:bg-black/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/40">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">UPI ID / VPA</p>
                        <p className="font-mono text-base font-bold text-amber-900 dark:text-amber-200 select-all">Pos.11410758@indus</p>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-black/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Bank</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">IndusInd Bank (BHIM UPI)</p>
                      </div>

                      <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                        * Please scan the QR code above or transfer to UPI ID <strong className="font-mono">Pos.11410758@indus</strong> to complete your payment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Payment Screenshot */}
                <div className="space-y-3">
                  <Label htmlFor="payment-screenshot" className="font-semibold text-base flex items-center justify-between">
                    <span>Upload Payment Screenshot <span className="text-red-500">*</span></span>
                    {paymentScreenshot && (
                      <span className="text-xs text-green-600 font-normal flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
                      </span>
                    )}
                  </Label>
                  
                  <div className="border-2 border-dashed rounded-xl p-4 text-center border-input hover:border-primary transition-colors">
                    {previewUrl || paymentScreenshot ? (
                      <div className="flex flex-col items-center space-y-3">
                        <img
                          src={previewUrl || paymentScreenshot}
                          alt="Payment Screenshot Preview"
                          className="max-h-48 rounded-lg border object-contain"
                        />
                        <div className="flex gap-2">
                          <label htmlFor="payment-screenshot" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" /> Change Screenshot
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="payment-screenshot" className="cursor-pointer flex flex-col items-center justify-center py-4">
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        )}
                        <span className="text-sm font-medium text-primary">
                          {isUploading ? "Uploading Screenshot..." : "Click to Upload Payment Proof Screenshot"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WebP up to 10MB
                        </span>
                      </label>
                    )}
                    <input
                      id="payment-screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                {/* WARNING NOTICE BOX */}
                <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/60 rounded-xl p-4 flex gap-3 items-start">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm uppercase tracking-wide">
                      Important Notice & Malpractice Policy
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                      We will manually check your payment details and confirm your registration. If there is any malpractice, fake screenshot, or invalid transaction details, your registration ticket will be rejected immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-base font-bold py-6 shadow-md"
                disabled={registerMutation.isPending || isUploading}
                size="lg"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Registration...
                  </>
                ) : (
                  <>
                    Submit Registration for Approval
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

