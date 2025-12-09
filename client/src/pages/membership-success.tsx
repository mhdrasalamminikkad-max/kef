import { motion } from "framer-motion";
import { Check, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function MembershipSuccess() {
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
              <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-membership-success">
                Membership Application Submitted!
              </h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your payment. Your membership application has been submitted successfully.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">What's Next?</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our team will review your application and contact you soon with your membership details.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-go-home">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
