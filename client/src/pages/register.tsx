import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { UserPlus, Calendar, MapPin, Sparkles, ArrowLeft, Check, CreditCard, Upload, Users, Plus } from "lucide-react";
import { insertBootcampSchema, type InsertBootcamp } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import qrCodeImage from "@assets/qrm_1764493655676.png";
import { useState, useEffect } from "react";

const REGISTRATIONS_COUNT_KEY = "kef:bootcamp-registrations-count";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { markRegistered, isRegistered } = useRegistrationStatus();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [addingAnother, setAddingAnother] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    const count = parseInt(localStorage.getItem(REGISTRATIONS_COUNT_KEY) || "0", 10);
    setRegistrationCount(count);
  }, []);

  const form = useForm<InsertBootcamp>({
    resolver: zodResolver(insertBootcampSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      organization: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image (JPEG, PNG, GIF) or PDF document.",
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
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: InsertBootcamp) => {
      const response = await apiRequest("POST", "/api/bootcamp", data);
      return response.json();
    },
    onSuccess: (data) => {
      markRegistered();
      const newCount = registrationCount + 1;
      localStorage.setItem(REGISTRATIONS_COUNT_KEY, newCount.toString());
      setRegistrationCount(newCount);
      form.reset();
      setUploadedFile(null);
      toast({
        title: "Registration Successful!",
        description: "Redirecting to your invitation...",
      });
      setLocation(`/invitation/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBootcamp) => {
    mutation.mutate(data);
  };

  const handleAddAnother = () => {
    setAddingAnother(true);
    setJustRegistered(false);
  };

  if ((isRegistered && !addingAnother) || justRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center backdrop-blur-sm bg-white/95">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-registration-success">
                  {justRegistered ? "Registration Successful!" : "You're Registered!"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {registrationCount > 1 
                    ? `You have registered ${registrationCount} people for the Startup Boot Camp.`
                    : "You have registered for the Startup Boot Camp."
                  }
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  We will contact you soon with more details.
                </p>

                <div className="space-y-3">
                  <Button 
                    onClick={handleAddAnother}
                    className="w-full btn-angular bg-blue-600 hover:bg-blue-700" 
                    data-testid="button-add-another"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Register Another Person
                  </Button>
                  
                  <Link href="/">
                    <Button variant="outline" className="w-full btn-angular" data-testid="button-go-home">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go to Home
                    </Button>
                  </Link>
                </div>

                {registrationCount > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center gap-2 text-blue-800">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">{registrationCount} Registration{registrationCount > 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      from this device
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Section for those who just registered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Card className="backdrop-blur-sm bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Complete Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center pt-0">
                <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                  <img 
                    src={qrCodeImage}
                    alt="Payment QR Code"
                    className="w-48 h-48 object-contain"
                    data-testid="img-payment-qr-success"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan to pay the registration fee
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" className="text-white" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            
            {registrationCount > 0 && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Users className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">{registrationCount} registered</span>
              </div>
            )}
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">3-Day Residential Experience</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            STARTUP <span className="text-yellow-400">BOOT CAMP</span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>December 26-28, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Caliph Life School, Kozhikode</span>
            </div>
          </div>
          
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Open to ages 15-29. Build an entrepreneurial mindset and turn ideas into real startups.
          </p>

          {addingAnother && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Plus className="w-4 h-4 text-green-400" />
              <span className="text-green-100 text-sm font-medium">Adding another registration</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/95">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <UserPlus className="w-5 h-5 text-blue-600" />
                {addingAnother ? "Register Another Person" : "Register for Startup Boot Camp"}
              </CardTitle>
              <CardDescription className="text-sm">
                Fill in the details below to secure a spot at the camp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} data-testid="input-fullname" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age *</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Age (15-29)" {...field} data-testid="input-age" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Organization / College</FormLabel>
                          <FormControl>
                            <Input placeholder="School/college/company (optional)" {...field} value={field.value ?? ""} data-testid="input-organization" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Document (Optional)
                    </FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-blue-500 transition-colors cursor-pointer" data-testid="upload-document-area">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="document-upload"
                          data-testid="input-document-upload"
                        />
                        <label htmlFor="document-upload" className="cursor-pointer block">
                          {uploadedFile ? (
                            <div className="text-sm">
                              <p className="font-semibold text-green-600 mb-1">File Selected</p>
                              <p className="text-gray-600">{uploadedFile.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {(uploadedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          ) : (
                            <div className="text-sm">
                              <p className="font-semibold text-gray-700 mb-1">Click to upload</p>
                              <p className="text-xs text-gray-400">
                                JPEG, PNG, GIF, PDF (Max 5MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>

                  <Button 
                    type="submit" 
                    className="w-full btn-angular bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={mutation.isPending}
                    data-testid="button-submit-registration"
                  >
                    {mutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {addingAnother ? "Register This Person" : "Register Now"}
                      </>
                    )}
                  </Button>

                  {addingAnother && (
                    <Button 
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setAddingAnother(false)}
                      data-testid="button-cancel-add"
                    >
                      Cancel
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* PAYMENT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 md:mt-8"
        >
          <Card className="backdrop-blur-sm bg-white/95">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                Complete Your Registration
              </CardTitle>
              <CardDescription className="text-sm">
                Scan the QR code to pay and confirm your spot.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 md:mb-6 p-4 md:p-6 bg-white rounded-lg border border-gray-200">
                <img 
                  src={qrCodeImage}
                  alt="Payment QR Code"
                  className="w-48 md:w-64 h-48 md:h-64 object-contain"
                  data-testid="img-payment-qr"
                />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2" data-testid="text-qr-title">
                UPI Payment
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4" data-testid="text-qr-description">
                Scan with any UPI app to pay the registration fee.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 md:p-4 w-full">
                <p className="text-xs md:text-sm text-blue-900" data-testid="text-qr-note">
                  <strong>Note:</strong> Keep your payment confirmation safe for camp registration.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
