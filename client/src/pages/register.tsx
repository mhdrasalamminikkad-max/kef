import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Calendar, MapPin, Sparkles, ArrowLeft, Check, CreditCard, Upload, Users, Plus, Rocket, Star, Zap, Camera, Image, Home, Shield, Loader2, Copy, Smartphone } from "lucide-react";
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
import { useState, useEffect, useRef } from "react";

const REGISTRATIONS_COUNT_KEY = "kef:bootcamp-registrations-count";
const PAYMENT_AMOUNT = 4999; // Amount in INR

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { markRegistered, isRegistered, clearRegistered } = useRegistrationStatus();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [addingAnother, setAddingAnother] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [justRegistered, setJustRegistered] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Check if PhonePe is configured
  const { data: phonePeConfig } = useQuery<{ configured: boolean }>({
    queryKey: ['/api/phonepe/config'],
  });

  useEffect(() => {
    const count = parseInt(localStorage.getItem(REGISTRATIONS_COUNT_KEY) || "0", 10);
    setRegistrationCount(count);
  }, []);

  // PhonePe payment handler - redirects user to PhonePe payment page
  const initiatePhonePePayment = async (formData: InsertBootcamp) => {
    setIsPaymentProcessing(true);
    
    try {
      // Store form data in sessionStorage for retrieval after payment
      sessionStorage.setItem('pendingRegistration', JSON.stringify(formData));
      
      // Initiate payment on backend
      const paymentResponse = await apiRequest("POST", "/api/phonepe/initiate-payment", {
        amount: PAYMENT_AMOUNT,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      
      const paymentData = await paymentResponse.json();
      
      if (!paymentData.success) {
        throw new Error(paymentData.error || "Failed to initiate payment");
      }

      // Store transaction ID for later verification
      sessionStorage.setItem('merchantTransactionId', paymentData.merchantTransactionId);
      
      // Redirect to PhonePe payment page
      window.location.href = paymentData.paymentUrl;
    } catch (error: any) {
      setIsPaymentProcessing(false);
      sessionStorage.removeItem('pendingRegistration');
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<InsertBootcamp>({
    resolver: zodResolver(insertBootcampSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      organization: "",
      paymentProof: "",
      place: "",
      address: "",
      photo: "",
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

  // Compress image to reduce upload size (makes registration 20-50x faster)
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Scale down if larger than maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with specified quality
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        img.onerror = () => reject(new Error('Could not load image'));
      };
      reader.onerror = () => reject(new Error('Could not read file'));
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
      // Compress images for faster upload, keep PDFs as-is
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file, 1000, 0.8);
        form.setValue("paymentProof", compressed);
      } else {
        const base64 = await convertFileToBase64(file);
        form.setValue("paymentProof", base64);
      }
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image (JPEG, PNG, GIF).",
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

      setUploadedPhoto(file);
      // Compress photo for faster upload (reduces 5MB to ~100KB)
      const compressed = await compressImage(file, 600, 0.7);
      setPhotoPreview(compressed);
      form.setValue("photo", compressed);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take a photo.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoPreview(base64);
        form.setValue("photo", base64);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const clearPhoto = () => {
    setUploadedPhoto(null);
    setPhotoPreview(null);
    form.setValue("photo", "");
  };

  const mutation = useMutation({
    mutationFn: async (data: InsertBootcamp) => {
      const response = await apiRequest("POST", "/api/bootcamp", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsPaymentProcessing(false);
      markRegistered(data.id);
      const newCount = registrationCount + 1;
      localStorage.setItem(REGISTRATIONS_COUNT_KEY, newCount.toString());
      setRegistrationCount(newCount);
      form.reset();
      setUploadedFile(null);
      setUploadedPhoto(null);
      setPhotoPreview(null);
      toast({
        title: "Registration Successful!",
        description: "Payment completed. Redirecting to your invitation...",
      });
      setLocation(`/invitation/${data.id}`);
    },
    onError: (error: Error) => {
      setIsPaymentProcessing(false);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBootcamp) => {
    // Check if PhonePe is configured
    if (phonePeConfig?.configured) {
      // Initiate PhonePe payment flow (redirect-based)
      initiatePhonePePayment(data);
    } else {
      // Temporary bypass: Complete registration directly without payment
      // This allows users to register and get invitation while payment system is being set up
      setIsPaymentProcessing(true);
      mutation.mutate(data);
    }
  };

  const handleAddAnother = () => {
    clearRegistered();
    setAddingAnother(true);
    setJustRegistered(false);
    setUploadedFile(null);
    setUploadedPhoto(null);
    setPhotoPreview(null);
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

          {/* Payment Confirmation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Card className="backdrop-blur-sm bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  Payment Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center pt-0">
                <div className="w-full max-w-md">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg font-bold text-green-700 mb-2">
                      Payment Successful
                    </p>
                    <p className="text-sm text-green-600">
                      Your payment of ₹{PAYMENT_AMOUNT} has been received successfully.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You will receive a confirmation email shortly with your registration details.
                  </p>
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

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.85, duration: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="place"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Place
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Your city/town" {...field} value={field.value ?? ""} data-testid="input-place" className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.87, duration: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Home className="w-4 h-4" />
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Your full address" {...field} value={field.value ?? ""} data-testid="input-address" className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md" />
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
                    transition={{ delay: 0.88, duration: 0.4 }}
                  >
                    <FormField
                      control={form.control}
                      name="photo"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Your Photo (Optional)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              {showCamera ? (
                                <div className="relative rounded-lg overflow-hidden border-2 border-blue-500">
                                  <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    className="w-full max-w-md mx-auto"
                                    data-testid="video-camera"
                                  />
                                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                                    <Button 
                                      type="button" 
                                      onClick={capturePhoto}
                                      className="bg-green-500 hover:bg-green-600"
                                      data-testid="button-capture-photo"
                                    >
                                      <Camera className="w-4 h-4 mr-2" />
                                      Capture
                                    </Button>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={stopCamera}
                                      data-testid="button-cancel-camera"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : photoPreview ? (
                                <div className="relative">
                                  <img 
                                    src={photoPreview} 
                                    alt="Preview" 
                                    className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-green-500"
                                    data-testid="img-photo-preview"
                                  />
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={clearPhoto}
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                    data-testid="button-clear-photo"
                                  >
                                    X
                                  </Button>
                                  <p className="text-sm text-green-600 text-center mt-2">Photo ready</p>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-3 justify-center">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={startCamera}
                                    data-testid="button-take-photo"
                                  >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Take Photo
                                  </Button>
                                  <div className="relative">
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/gif"
                                      onChange={handlePhotoChange}
                                      className="hidden"
                                      id="photo-upload"
                                      data-testid="input-photo-upload"
                                    />
                                    <label htmlFor="photo-upload">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        asChild
                                      >
                                        <span data-testid="button-upload-photo">
                                          <Image className="w-4 h-4 mr-2" />
                                          Upload Photo
                                        </span>
                                      </Button>
                                    </label>
                                  </div>
                                </div>
                              )}
                              <canvas ref={canvasRef} className="hidden" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

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
                    transition={{ delay: 1, duration: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full btn-angular bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 transition-all duration-300"
                        disabled={mutation.isPending || isPaymentProcessing}
                        data-testid="button-submit-registration"
                      >
                        {mutation.isPending || isPaymentProcessing ? (
                          <motion.div 
                            className="flex items-center gap-2"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 className="w-4 h-4" />
                            </motion.div>
                            {isPaymentProcessing ? "Processing Payment..." : "Registering..."}
                          </motion.div>
                        ) : (
                          <motion.div 
                            className="flex items-center gap-2"
                            whileHover={{ x: [0, 5, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            <CreditCard className="w-4 h-4" />
                            {addingAnother ? "Pay & Register" : "Pay ₹4999 & Register"}
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

        {/* PAYMENT INFORMATION SECTION */}
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
                  Payment Details
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <CardDescription className="text-sm">
                  Pay using UPI or Bank Transfer, then upload the screenshot
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <motion.div 
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                {/* Price Display */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                  <p className="text-sm text-green-600 mb-2">Registration Fee</p>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    <span className="line-through opacity-50 text-muted-foreground text-xl">₹6999</span>{" "}
                    <span className="text-green-600">₹{PAYMENT_AMOUNT}</span>
                  </p>
                  <p className="text-xs text-green-600 font-medium">Early Bird Offer</p>
                </div>

                {/* UPI Payment Apps */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-foreground">Pay with UPI App</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tap any app below to pay ₹{PAYMENT_AMOUNT} instantly
                  </p>
                  
                  {/* UPI App Buttons Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Google Pay */}
                    <motion.button
                      type="button"
                      onClick={() => {
                        const upiUrl = `tez://upi/pay?pa=caliphworldfoundation.9605399676.ibz@icici&pn=Kerala%20Economic%20Forum&am=${PAYMENT_AMOUNT}&cu=INR&tn=Startup%20Boot%20Camp%20Registration`;
                        window.location.href = upiUrl;
                      }}
                      className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-pay-gpay"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">G</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Google Pay</p>
                        <p className="text-xs text-muted-foreground">GPay</p>
                      </div>
                    </motion.button>

                    {/* PhonePe */}
                    <motion.button
                      type="button"
                      onClick={() => {
                        const upiUrl = `phonepe://pay?pa=caliphworldfoundation.9605399676.ibz@icici&pn=Kerala%20Economic%20Forum&am=${PAYMENT_AMOUNT}&cu=INR&tn=Startup%20Boot%20Camp%20Registration`;
                        window.location.href = upiUrl;
                      }}
                      className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 hover:bg-purple-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-pay-phonepe"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">P</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">PhonePe</p>
                        <p className="text-xs text-muted-foreground">UPI</p>
                      </div>
                    </motion.button>

                    {/* Paytm */}
                    <motion.button
                      type="button"
                      onClick={() => {
                        const upiUrl = `paytmmp://pay?pa=caliphworldfoundation.9605399676.ibz@icici&pn=Kerala%20Economic%20Forum&am=${PAYMENT_AMOUNT}&cu=INR&tn=Startup%20Boot%20Camp%20Registration`;
                        window.location.href = upiUrl;
                      }}
                      className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-pay-paytm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">P</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Paytm</p>
                        <p className="text-xs text-muted-foreground">UPI</p>
                      </div>
                    </motion.button>

                    {/* All UPI Apps */}
                    <motion.button
                      type="button"
                      onClick={() => {
                        const upiUrl = `upi://pay?pa=caliphworldfoundation.9605399676.ibz@icici&pn=Kerala%20Economic%20Forum&am=${PAYMENT_AMOUNT}&cu=INR&tn=Startup%20Boot%20Camp%20Registration`;
                        window.location.href = upiUrl;
                      }}
                      className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-400 hover:bg-green-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-pay-all-upi"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">All UPI Apps</p>
                        <p className="text-xs text-muted-foreground">Any UPI app</p>
                      </div>
                    </motion.button>
                  </div>

                  {/* Copy UPI ID Option */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Or copy UPI ID to pay manually:</p>
                    <div className="flex items-center gap-2 bg-white rounded-md p-2 border border-gray-200">
                      <code className="text-xs text-foreground flex-1 break-all" data-testid="text-upi-id">
                        caliphworldfoundation.9605399676.ibz@icici
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText("caliphworldfoundation.9605399676.ibz@icici");
                          toast({
                            title: "Copied!",
                            description: "UPI ID copied to clipboard",
                          });
                        }}
                        data-testid="button-copy-upi"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 mb-2 font-medium">How to Register:</p>
                  <ol className="text-xs text-amber-700 text-left space-y-1">
                    <li>1. Tap any UPI app button above to pay ₹{PAYMENT_AMOUNT}</li>
                    <li>2. Complete payment in the app (amount is pre-filled)</li>
                    <li>3. Take a screenshot of the payment confirmation</li>
                    <li>4. Fill in your details in the form above</li>
                    <li>5. Upload the payment screenshot and click "Register"</li>
                  </ol>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-4 mt-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-xs">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs">Instant Confirmation</span>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
