import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Sparkles, 
  ArrowLeft, 
  Download,
  CheckCircle2,
  Phone,
  Mail
} from "lucide-react";
import type { Bootcamp } from "@shared/schema";

export default function Invitation() {
  const [, params] = useRoute("/invitation/:id");
  const registrationId = params?.id;

  const { data: registration, isLoading, error } = useQuery<Bootcamp>({
    queryKey: ['/api/bootcamp', registrationId],
    enabled: !!registrationId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your invitation...</div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="text-red-500 text-6xl mb-4">!</div>
            <h2 className="text-xl font-bold mb-2">Invitation Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find this invitation. Please check the link or register again.
            </p>
            <Link href="/register">
              <Button data-testid="button-register-again">Register Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const qrData = JSON.stringify({
    id: registration.id,
    name: registration.fullName,
    email: registration.email,
    phone: registration.phone,
    event: "Startup Boot Camp 2025",
    date: "December 26-28, 2025"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" className="text-white" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-yellow-400/30">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 border-4 border-white rounded-full translate-x-1/4 translate-y-1/4"></div>
              </div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white text-sm font-medium">Official Invitation</span>
                </motion.div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  STARTUP BOOT CAMP
                </h1>
                <p className="text-white/90 text-lg">3-Day Residential Experience</p>
              </div>
            </div>

            <CardContent className="p-6 md:p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span className="text-green-600 font-semibold">Registration Confirmed</span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2" data-testid="text-participant-name">
                    Dear {registration.fullName},
                  </h2>
                  <p className="text-muted-foreground">
                    You are officially invited to join the Startup Boot Camp 2025!
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-6 mb-8"
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Event Details
                </h3>
                
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-muted-foreground">December 26-28, 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Venue</p>
                      <p className="text-muted-foreground">Caliph Life School, Kozhikode</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Check-in Time</p>
                      <p className="text-muted-foreground">December 26, 9:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Age Group</p>
                      <p className="text-muted-foreground">15-29 years</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8"
              >
                <h3 className="font-bold text-lg mb-4">What to Bring</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Valid ID proof (Aadhar/Student ID)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Comfortable clothing for 3 days
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Notebook and pen for sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Laptop (if available)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    This QR code (screenshot or print)
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mb-8"
              >
                <h3 className="font-bold text-lg mb-4">Your Entry Pass</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Show this QR code at the venue for entry
                </p>
                
                <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-4 border-yellow-400" data-testid="qr-code-container">
                  <QRCodeSVG
                    value={qrData}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor="#1e3a8a"
                    bgColor="#ffffff"
                  />
                </div>
                
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-mono text-muted-foreground" data-testid="text-registration-id">
                    ID: {registration.id.slice(0, 8).toUpperCase()}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {registration.status === "approved" ? "Approved" : "Pending Approval"}
                  </Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4 mb-8 border border-yellow-200 dark:border-yellow-800"
              >
                <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">Important Notes</h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>Food and accommodation will be provided</li>
                  <li>Please arrive on time for check-in</li>
                  <li>Contact us if you need any special arrangements</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center border-t pt-6"
              >
                <h3 className="font-bold mb-4">Contact Us</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+91 XXXXXXXXXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>bootcamp@keralaeconomicforum.org</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                  data-testid="button-print-invitation"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save / Print
                </Button>
                <Link href="/">
                  <Button data-testid="button-go-home">
                    Go to Home
                  </Button>
                </Link>
              </motion.div>
            </CardContent>

            <div className="bg-gradient-to-r from-red-600 to-yellow-500 p-4 text-center">
              <p className="text-white text-sm font-medium">
                Kerala Economic Forum - Empowering Entrepreneurs
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-6 text-white/60 text-sm"
        >
          <p>We look forward to seeing you at the event!</p>
        </motion.div>
      </div>
    </div>
  );
}
