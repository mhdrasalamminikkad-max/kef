import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Building2, 
  MapPin, 
  Calendar,
  CreditCard,
  Image as ImageIcon,
  ArrowLeft,
  Shield,
  Sparkles,
  Mail,
  Phone,
  Briefcase,
  Award,
  Star
} from "lucide-react";

interface BootcampData {
  type: 'bootcamp';
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  district: string;
  photo?: string;
  paymentProof: string;
  status: string;
  createdAt: string;
}

interface MembershipData {
  type: 'membership';
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  designation?: string;
  membershipType: string;
  interests: string;
  paymentAmount?: string;
  paymentScreenshot?: string;
  status: string;
  createdAt: string;
}

type VerificationData = BootcampData | MembershipData;

const membershipTypeLabels: Record<string, string> = {
  individual: 'Individual Membership',
  student: 'Student Membership',
  corporate: 'Corporate Membership',
  institutional: 'Institutional Membership',
};

const membershipBenefits: Record<string, string[]> = {
  individual: [
    'Access to all KEF events and workshops',
    'Networking opportunities with entrepreneurs',
    'Monthly newsletter and updates',
    'Discounts on event registrations',
    'Access to online resources and materials'
  ],
  student: [
    'Access to student-focused programs',
    'Mentorship opportunities',
    'Career guidance sessions',
    'Internship connections',
    'Free access to workshops'
  ],
  corporate: [
    'Priority access to all KEF events',
    'Company branding at KEF events',
    'Multiple employee registrations',
    'Exclusive B2B networking sessions',
    'Partnership opportunities',
    'Dedicated relationship manager'
  ],
  institutional: [
    'Collaboration on research projects',
    'Joint event organization',
    'Student exchange programs',
    'Faculty development programs',
    'Industry-academia partnerships',
    'Access to KEF resource network'
  ]
};

export default function VerifyPage() {
  const params = useParams<{ id: string }>();
  const registrationId = params.id;

  const { data: verificationData, isLoading, error } = useQuery<VerificationData>({
    queryKey: ['/api/verify', registrationId],
    enabled: !!registrationId,
    staleTime: 5 * 60 * 1000,
  });

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          borderColor: 'border-green-500',
          label: 'Approved',
          description: 'Membership has been verified and approved'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          borderColor: 'border-red-500',
          label: 'Rejected',
          description: 'Application was not approved'
        };
      default:
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          borderColor: 'border-yellow-500',
          label: 'Pending',
          description: 'Application is being reviewed'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="text-white text-lg">Verifying...</div>
        </div>
      </div>
    );
  }

  if (error || !verificationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find this registration or membership. The QR code may be invalid.
            </p>
            <Link href="/">
              <Button data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(verificationData.status);
  const StatusIcon = statusConfig.icon;
  const isMembership = verificationData.type === 'membership';

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
          <Card className="overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-blue-400/30">
            <div className={`p-6 text-center relative overflow-hidden ${
              isMembership 
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500' 
                : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500'
            }`}>
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
                  {isMembership ? (
                    <>
                      <Award className="w-4 h-4 text-yellow-300" />
                      <span className="text-white text-sm font-medium">Membership Verification</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-cyan-300" />
                      <span className="text-white text-sm font-medium">Registration Verification</span>
                    </>
                  )}
                </motion.div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {isMembership ? 'KEF Membership' : 'Startup Boot Camp 2025'}
                </h1>
                <p className="text-white/80 text-sm">
                  Kerala Economic Forum
                </p>
              </div>
            </div>

            <CardContent className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-4 rounded-lg ${statusConfig.bgColor} border-2 ${statusConfig.borderColor} mb-6`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center`}>
                    <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{statusConfig.label}</span>
                      {verificationData.status.toLowerCase() === 'approved' && (
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{statusConfig.description}</p>
                  </div>
                </div>
              </motion.div>

              {isMembership && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-6"
                >
                  <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg p-4 border border-amber-300 dark:border-amber-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-800 dark:text-amber-300">
                        {membershipTypeLabels[(verificationData as MembershipData).membershipType] || 'Membership'}
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-400">Valid for 1 Year from approval date</p>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  {isMembership ? 'Member Details' : 'Participant Details'}
                </h3>
                
                <div className="grid gap-4">
                  {!isMembership && (verificationData as BootcampData).photo && (
                    <div className="flex justify-center mb-2">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400/30">
                        <img 
                          src={(verificationData as BootcampData).photo} 
                          alt={verificationData.fullName}
                          className="w-full h-full object-cover"
                          data-testid="img-participant-photo"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="font-medium" data-testid="text-participant-name">{verificationData.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium" data-testid="text-email">{verificationData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium" data-testid="text-phone">{verificationData.phone}</p>
                      </div>
                    </div>

                    {verificationData.organization && (
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Organization</p>
                          <p className="font-medium" data-testid="text-participant-org">{verificationData.organization}</p>
                        </div>
                      </div>
                    )}

                    {isMembership && (verificationData as MembershipData).designation && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Designation</p>
                          <p className="font-medium" data-testid="text-designation">{(verificationData as MembershipData).designation}</p>
                        </div>
                      </div>
                    )}

                    {!isMembership && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">District</p>
                          <p className="font-medium" data-testid="text-participant-location">
                            {(verificationData as BootcampData).district}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{isMembership ? 'Member Since' : 'Registered On'}</p>
                        <p className="font-medium" data-testid="text-registration-date">
                          {new Date(verificationData.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {isMembership && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-6"
                >
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Membership Benefits
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {(membershipBenefits[(verificationData as MembershipData).membershipType] || membershipBenefits.individual).map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Payment Proof
                </h3>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  {(isMembership ? (verificationData as MembershipData).paymentScreenshot : (verificationData as BootcampData).paymentProof) ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Payment Submitted
                        </Badge>
                        {isMembership && (verificationData as MembershipData).paymentAmount && (
                          <Badge variant="outline">
                            Amount: {(verificationData as MembershipData).paymentAmount}
                          </Badge>
                        )}
                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img 
                          src={isMembership ? (verificationData as MembershipData).paymentScreenshot : (verificationData as BootcampData).paymentProof} 
                          alt="Payment Proof"
                          className="w-full h-auto max-h-96 object-contain bg-white dark:bg-gray-800"
                          data-testid="img-payment-proof"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <div className="flex items-center gap-2 text-white text-sm">
                            <ImageIcon className="w-4 h-4" />
                            <span>Payment Screenshot</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No payment proof uploaded</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <div className="text-center text-sm text-muted-foreground">
                  <p>{isMembership ? 'Member' : 'Registration'} ID: <span className="font-mono text-xs">{verificationData.id}</span></p>
                  <p className="mt-2">
                    This verification was performed on {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-white/60 text-sm">
            Verified by Kerala Economic Forum
          </p>
        </motion.div>
      </div>
    </div>
  );
}
