import { useEffect, useState } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, X, Loader2, AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import type { InsertBootcamp } from "@shared/schema";
import { Link } from "wouter";

export default function PaymentStatus() {
  const params = useParams<{ merchantTransactionId: string }>();
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { markRegistered } = useRegistrationStatus();
  const [status, setStatus] = useState<"checking" | "success" | "failed" | "error">("checking");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasProcessed, setHasProcessed] = useState(false);

  const merchantTransactionId = params.merchantTransactionId;
  
  const searchParams = new URLSearchParams(searchString);
  const urlStatus = searchParams.get("status");
  const urlCode = searchParams.get("code");

  const { data: paymentStatus, isLoading, refetch } = useQuery<{
    success: boolean;
    code: string;
    message: string;
    transactionId: string;
  }>({
    queryKey: ['/api/phonepe/status', merchantTransactionId],
    queryFn: async () => {
      const response = await fetch(`/api/phonepe/status/${merchantTransactionId}`);
      return response.json();
    },
    enabled: !!merchantTransactionId,
    retry: 2,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertBootcamp) => {
      const response = await apiRequest("POST", "/api/bootcamp", data);
      return response.json();
    },
    onSuccess: (data) => {
      markRegistered(data.id);
      sessionStorage.removeItem('pendingRegistration');
      sessionStorage.removeItem('merchantTransactionId');
      toast({
        title: "Registration Successful!",
        description: "Your payment was successful and registration is complete.",
      });
      setLocation(`/invitation/${data.id}`);
    },
    onError: (error: Error) => {
      setStatus("error");
      setErrorMessage(error.message || "Failed to complete registration");
      toast({
        title: "Registration Failed",
        description: "Payment was successful but registration failed. Please contact support.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (hasProcessed) return;
    
    if (urlStatus === "success" || paymentStatus?.success) {
      setStatus("success");
      
      const pendingRegistrationStr = sessionStorage.getItem('pendingRegistration');
      if (pendingRegistrationStr) {
        try {
          const pendingRegistration = JSON.parse(pendingRegistrationStr) as InsertBootcamp;
          const registrationWithPayment = {
            ...pendingRegistration,
            paymentProof: `PhonePe Transaction ID: ${merchantTransactionId}`,
          };
          setHasProcessed(true);
          registerMutation.mutate(registrationWithPayment);
        } catch (error) {
          setStatus("error");
          setErrorMessage("Failed to process registration data");
        }
      } else {
        setStatus("error");
        setErrorMessage("Registration data not found. Please register again.");
      }
    } else if (urlStatus === "failed" || urlStatus === "error") {
      setStatus("failed");
      setErrorMessage(urlCode ? `Payment failed with code: ${urlCode}` : "Payment was not successful");
      sessionStorage.removeItem('pendingRegistration');
      sessionStorage.removeItem('merchantTransactionId');
    } else if (paymentStatus && !paymentStatus.success) {
      setStatus("failed");
      setErrorMessage(paymentStatus.message || "Payment verification failed");
      sessionStorage.removeItem('pendingRegistration');
      sessionStorage.removeItem('merchantTransactionId');
    }
  }, [urlStatus, paymentStatus, hasProcessed]);

  const handleRetry = () => {
    sessionStorage.removeItem('pendingRegistration');
    sessionStorage.removeItem('merchantTransactionId');
    setLocation("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-white/95">
            <CardContent className="pt-8 pb-8 text-center">
              {(status === "checking" || isLoading || registerMutation.isPending) && (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-payment-checking">
                    {registerMutation.isPending ? "Completing Registration..." : "Verifying Payment..."}
                  </h2>
                  <p className="text-muted-foreground">
                    Please wait while we process your payment.
                  </p>
                </>
              )}

              {status === "success" && !registerMutation.isPending && (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-payment-success">
                    Payment Successful!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your payment has been verified. Completing registration...
                  </p>
                </>
              )}

              {status === "failed" && (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-payment-failed">
                    Payment Failed
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {errorMessage || "Your payment could not be processed."}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Please try again or contact support if the issue persists.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleRetry}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      data-testid="button-retry-payment"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Link href="/">
                      <Button variant="outline" className="w-full" data-testid="button-go-home">
                        <Home className="w-4 h-4 mr-2" />
                        Go to Home
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-payment-error">
                    Something Went Wrong
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {errorMessage || "An unexpected error occurred."}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    If your payment was deducted, please contact support with Transaction ID: {merchantTransactionId}
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleRetry}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      data-testid="button-retry-payment"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Link href="/">
                      <Button variant="outline" className="w-full" data-testid="button-go-home">
                        <Home className="w-4 h-4 mr-2" />
                        Go to Home
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 text-center"
        >
          <p className="text-white/60 text-sm">
            Transaction ID: {merchantTransactionId}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
