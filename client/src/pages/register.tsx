import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Calendar, MapPin, Sparkles, ArrowLeft, Check, CreditCard, Upload, Users, Plus, Wallet, Rocket, Star, Zap } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Info } from "lucide-react";

const REGISTRATIONS_COUNT_KEY = "kef:bootcamp-registrations-count";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { markRegistered, isRegistered, clearRegistered } = useRegistrationStatus();
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
      paymentProof: "",
      source: "",
    },
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const base64 = await convertFileToBase64(file);
      form.setValue("paymentProof", base64);
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
    clearRegistered();
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
                <a 
                  href="upi://pay?pa=caliphworldfoundation.9605399676.ibz@icici&pn=Caliph+World+Foundation&am=4999&tn=Event+Entry&cu=INR"
                  className="w-full max-w-md"
                  data-testid="link-upi-payment-success"
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-base shadow-lg shadow-green-500/30 rounded-xl"
                    data-testid="button-upi-payment-success"
                  >
                    <Wallet className="w-5 h-5 mr-3" />
                    <span className="line-through opacity-75">₹7999</span> Only <span className="font-bold">₹4999</span> Pay Now
                  </Button>
                </a>
                <p className="text-sm text-muted-foreground mt-4 mb-6">
                  Opens Google Pay, PhonePe, Paytm or any UPI app
                </p>

                {/* Manual Payment Details */}
                <div className="w-full border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Or Pay Manually</h4>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 mb-4 text-left border border-blue-200">
                    <p className="text-xs font-semibold text-blue-600 mb-2 tracking-wide">UPI ID</p>
                    <p className="text-base font-semibold tracking-wide text-gray-800 font-sans break-all" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", letterSpacing: '0.3px' }}>
                      caliphworldfoundation.9605399676.ibz@icici
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <p className="text-xs text-muted-foreground mb-3">Account Details</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">CALIPH WORLD FOUNDATION</p>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Bank</span>
                        <span className="text-sm text-foreground">ICICI BANK</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Branch</span>
                        <span className="text-sm text-foreground">MUKKAM BRANCH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">A/C No</span>
                        <span className="text-sm font-mono font-medium text-foreground">265405000474</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">IFSC</span>
                        <span className="text-sm font-mono font-medium text-foreground">ICIC0002654</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(234, 179, 8, 0.3)",
        "0 0 40px rgba(234, 179, 8, 0.5)",
        "0 0 20px rgba(234, 179, 8, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 md:py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-red-400/10 rounded-full blur-2xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-6 md:mb-8"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" className="text-white" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            
            {registrationCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5"
              >
                <Users className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">{registrationCount} registered</span>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
          >
            <motion.div variants={sparkleVariants} animate="animate">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
            <span className="text-white text-sm font-medium">3-Day Residential Experience</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            STARTUP <motion.span 
              className="text-yellow-400 inline-block"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(234, 179, 8, 0.5)",
                  "0 0 20px rgba(234, 179, 8, 0.8)",
                  "0 0 10px rgba(234, 179, 8, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >BOOT CAMP</motion.span>
          </motion.h1>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 md:gap-6 text-white/80 text-sm"
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05, color: "#fff" }}
            >
              <Calendar className="w-4 h-4" />
              <span>December 26-28, 2025</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05, color: "#fff" }}
            >
              <MapPin className="w-4 h-4" />
              <span>Caliph Life School, Kozhikode</span>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-8 md:mt-10 max-w-2xl mx-auto"
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              variants={floatingVariants}
              animate="animate"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-400/20 to-cyan-500/20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative p-6 md:p-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md border border-white/30">
                <div className="space-y-4">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <p className="text-gray-600 text-sm md:text-base font-medium mb-2">Standard Camp Fee</p>
                    <motion.p 
                      className="text-3xl md:text-4xl font-black text-gray-800"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="line-through text-gray-400 text-2xl md:text-3xl">₹6999</span>
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300"
                    variants={glowVariants}
                    animate="animate"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <motion.div variants={sparkleVariants} animate="animate">
                        <Star className="w-4 h-4 text-yellow-500" />
                      </motion.div>
                      <p className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Early Bird Special</p>
                      <motion.div variants={sparkleVariants} animate="animate">
                        <Star className="w-4 h-4 text-yellow-500" />
                      </motion.div>
                    </div>
                    <motion.p 
                      className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500"
                      variants={pulseVariants}
                      animate="animate"
                    >
                      ₹4999
                    </motion.p>
                    <motion.p 
                      className="text-cyan-600 text-xs md:text-sm font-bold mt-2"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Valid till December 10, 2025
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-white/70 mt-4 max-w-2xl mx-auto text-sm md:text-base"
          >
            Open to ages 15-39. Build an entrepreneurial mindset and turn ideas into real startups.
          </motion.p>

          <AnimatePresence>
            {addingAnother && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="mt-4 inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Plus className="w-4 h-4 text-green-400" />
                </motion.div>
                <span className="text-green-100 text-sm font-medium">Adding another registration</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <Card className="backdrop-blur-sm bg-white/95 overflow-visible shadow-xl">
            <CardHeader className="pb-4 md:pb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 3 
                    }}
                  >
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  {addingAnother ? "Register Another Person" : "Register for Startup Boot Camp"}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <CardDescription className="text-sm">
                  Fill in the details below to secure a spot at the camp.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} data-testid="input-fullname" className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} data-testid="input-email" className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} data-testid="input-phone" className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age *</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Age (15-39)" {...field} data-testid="input-age" className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                      className="md:col-span-2"
                    >
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution / Organization *</FormLabel>
                            <FormControl>
                              <Input placeholder="School, College, or Company name" {...field} value={field.value ?? ""} data-testid="input-organization" className="transition-all duration-300 focus:scale-[1.01] focus:shadow-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    <FormField
                      control={form.control}
                      name="paymentProof"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <motion.div
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Upload className="w-4 h-4" />
                            </motion.div>
                            Payment Screenshot *
                          </FormLabel>
                          <FormControl>
                            <motion.div 
                              className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-all duration-300 cursor-pointer ${uploadedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30'}`} 
                              data-testid="upload-payment-area"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="payment-upload"
                                data-testid="input-payment-upload"
                              />
                              <label htmlFor="payment-upload" className="cursor-pointer block">
                                <AnimatePresence mode="wait">
                                  {uploadedFile ? (
                                    <motion.div 
                                      key="uploaded"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      className="text-sm"
                                    >
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                      >
                                        <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                      </motion.div>
                                      <p className="font-semibold text-green-600 mb-1">Payment Proof Uploaded</p>
                                      <p className="text-gray-600">{uploadedFile.name}</p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {(uploadedFile.size / 1024).toFixed(2)} KB
                                      </p>
                                    </motion.div>
                                  ) : (
                                    <motion.div 
                                      key="upload"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="text-sm"
                                    >
                                      <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                      >
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                      </motion.div>
                                      <p className="font-semibold text-gray-700 mb-1">Upload Payment Screenshot</p>
                                      <p className="text-xs text-gray-400">
                                        JPEG, PNG, GIF, PDF (Max 5MB)
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </label>
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95, duration: 0.4 }}
                  >
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            How did you hear about us?
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? ""}>
                            <FormControl>
                              <SelectTrigger className="transition-all duration-300 focus:scale-[1.01] focus:shadow-md" data-testid="select-source">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="telegram">Telegram</SelectItem>
                              <SelectItem value="friend">Friend / Family</SelectItem>
                              <SelectItem value="school">School / College</SelectItem>
                              <SelectItem value="teacher">Teacher / Mentor</SelectItem>
                              <SelectItem value="poster">Poster / Banner</SelectItem>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full btn-angular bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 transition-all duration-300"
                        disabled={mutation.isPending}
                        data-testid="button-submit-registration"
                      >
                        {mutation.isPending ? (
                          <motion.div 
                            className="flex items-center gap-2"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Rocket className="w-4 h-4" />
                            </motion.div>
                            Submitting...
                          </motion.div>
                        ) : (
                          <motion.div 
                            className="flex items-center gap-2"
                            whileHover={{ x: [0, 5, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            <Rocket className="w-4 h-4" />
                            {addingAnother ? "Register This Person" : "Register Now"}
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {addingAnother && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Button 
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={() => setAddingAnother(false)}
                          data-testid="button-cancel-add"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* PAYMENT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="mt-6 md:mt-8"
        >
          <Card className="backdrop-blur-sm bg-white/95 overflow-visible shadow-xl">
            <CardHeader className="pb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <CardTitle className="flex items-center gap-2 text-lg">
                  <motion.div
                    animate={{ 
                      rotateY: [0, 360],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      repeatDelay: 2 
                    }}
                  >
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </motion.div>
                  Complete Your Registration
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <CardDescription className="text-sm">
                  Click the button below to pay instantly via UPI.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <motion.a 
                href="upi://pay?pa=caliphworldfoundation.9605399676.ibz@icici&pn=Caliph+World+Foundation&am=4999&tn=Event+Entry&cu=INR"
                className="w-full max-w-md"
                data-testid="link-upi-payment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 10px 30px rgba(34, 197, 94, 0.3)",
                      "0 15px 40px rgba(34, 197, 94, 0.5)",
                      "0 10px 30px rgba(34, 197, 94, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-xl"
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-base md:text-lg rounded-xl"
                    data-testid="button-upi-payment"
                  >
                    <motion.div
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Wallet className="w-5 h-5 mr-3" />
                    </motion.div>
                    <span className="line-through opacity-75">₹7999</span> Only <span className="font-bold">₹4999</span> Pay Now
                  </Button>
                </motion.div>
              </motion.a>
              <p className="text-xs md:text-sm text-muted-foreground mt-4 mb-6" data-testid="text-upi-description">
                Opens Google Pay, PhonePe, Paytm or any UPI app
              </p>

              {/* Manual Payment Details */}
              <div className="w-full border-t border-gray-200 pt-6 mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-4">Or Pay Manually</h4>
                
                {/* UPI ID */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 mb-4 text-left border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 mb-2 tracking-wide">UPI ID</p>
                  <p className="text-base font-semibold tracking-wide text-gray-800 font-sans break-all" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", letterSpacing: '0.3px' }} data-testid="text-upi-id">
                    caliphworldfoundation.9605399676.ibz@icici
                  </p>
                </div>

                {/* Bank Account Details */}
                <div className="bg-gray-50 rounded-lg p-4 text-left mb-4">
                  <p className="text-xs text-muted-foreground mb-3">Account Details</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground" data-testid="text-account-name">CALIPH WORLD FOUNDATION</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Bank</span>
                      <span className="text-sm text-foreground" data-testid="text-bank-name">ICICI BANK</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Branch</span>
                      <span className="text-sm text-foreground" data-testid="text-branch">MUKKAM BRANCH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">A/C No</span>
                      <span className="text-sm font-mono font-medium text-foreground" data-testid="text-account-number">265405000474</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">IFSC</span>
                      <span className="text-sm font-mono font-medium text-foreground" data-testid="text-ifsc">ICIC0002654</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-lg p-4 border border-gray-300 flex flex-col items-center">
                  <p className="text-xs text-muted-foreground mb-3">Scan to Pay via UPI</p>
                  <img 
                    src="/IMG_3535_1764520833105.PNG"
                    alt="UPI Payment QR Code" 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-lg"
                    data-testid="img-qr-code"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 md:p-4 w-full">
                <p className="text-xs md:text-sm text-blue-900" data-testid="text-payment-note">
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
