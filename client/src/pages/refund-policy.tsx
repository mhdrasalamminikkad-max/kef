import { motion } from "framer-motion";
import { RefreshCcw, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="text-white mb-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <RefreshCcw className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Refund Policy</h1>
            <p className="text-white/70">Last updated: December 2025</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-slate dark:prose-invert max-w-none"
        >
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Overview</h2>
            <p className="text-muted-foreground">
              This Refund Policy outlines the terms and conditions for refunds related to Caliph World Foundation's 
              programs and events operated under Kerala Economic Forum, including the Startup Boot Camp and other paid services. We strive to ensure 
              complete satisfaction with our programs while maintaining fair policies for all participants.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Cancellation and Refund Eligibility</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Cancellation by Participant</h3>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>More than 15 days before event:</strong> Full refund (100%) minus payment gateway charges</li>
                <li><strong>7-15 days before event:</strong> 50% refund minus payment gateway charges</li>
                <li><strong>Less than 7 days before event:</strong> No refund, but registration can be transferred to another person</li>
                <li><strong>No-show on event day:</strong> No refund will be provided</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Cancellation by Caliph World Foundation</h3>
            <p className="text-muted-foreground mb-4">
              If Caliph World Foundation cancels a program due to unforeseen circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Full refund (100%) will be provided within 7-10 business days</li>
              <li>Alternatively, participants may opt to transfer their registration to a future program</li>
              <li>We will notify all registered participants via email and phone</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How to Request a Refund</h2>
            <p className="text-muted-foreground mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
              <li>Send an email to <strong>keralaeconomicforum@gmail.com</strong> with subject line: "Refund Request - [Your Name]"</li>
              <li>Include your registration ID, registered email, and phone number</li>
              <li>Provide reason for cancellation</li>
              <li>Our team will respond within 2-3 business days</li>
              <li>Approved refunds will be processed to the original payment method</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Refund Processing</h2>
            <p className="text-muted-foreground mb-4">
              Once a refund is approved:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Refunds are processed through PhonePe payment gateway</li>
              <li>Processing time: 7-10 business days from approval date</li>
              <li>Refund will be credited to the same payment source (bank account/UPI) used for payment</li>
              <li>Payment gateway charges (if any) are non-refundable</li>
              <li>You will receive an email confirmation once the refund is initiated</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Registration Transfer</h2>
            <p className="text-muted-foreground mb-4">
              Instead of a refund, you may transfer your registration to another person:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Transfer requests must be made at least 3 days before the event</li>
              <li>The new participant must meet all eligibility criteria</li>
              <li>Complete the transfer request form or email us with new participant details</li>
              <li>No additional fee for registration transfer</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Non-Refundable Items</h2>
            <p className="text-muted-foreground mb-4">
              The following are non-refundable under any circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Payment gateway processing fees</li>
              <li>Convenience fees (if applicable)</li>
              <li>Cancellations made within 7 days of the event (unless by KEF)</li>
              <li>No-show registrations</li>
              <li>Registrations where benefits have already been partially utilized</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Program Rescheduling</h2>
            <p className="text-muted-foreground">
              If a program is rescheduled (not cancelled), participants will have the option to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Attend the rescheduled program on the new dates</li>
              <li>Request a full refund within 7 days of the rescheduling announcement</li>
              <li>Transfer registration to another participant</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Special Circumstances</h2>
            <p className="text-muted-foreground">
              We understand that emergencies happen. In cases of medical emergencies, bereavement, or other 
              extraordinary circumstances, please contact us with supporting documentation. We will review 
              such requests on a case-by-case basis and may provide exceptions to the standard policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Disputes</h2>
            <p className="text-muted-foreground">
              For any disputes related to payments or refunds processed through PhonePe, please contact 
              PhonePe's customer support or raise a dispute through the PhonePe app. You may also contact 
              us directly, and we will assist in resolving the issue.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact for Refunds</h2>
            <p className="text-muted-foreground mb-4">
              For all refund-related queries, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li><strong>Organization:</strong> Caliph World Foundation</li>
              <li><strong>Email:</strong> keralaeconomicforum@gmail.com</li>
              <li><strong>Phone:</strong> +91 9072344431 (WhatsApp available)</li>
              <li><strong>Address:</strong> Caliph World Foundation, Level 3, Venture Arcade, Mavoor Rd, above Croma, Thondayad, Kozhikode, Kerala 673016</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Business Hours:</strong> Monday to Saturday, 10:00 AM to 6:00 PM IST
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Policy Updates</h2>
            <p className="text-muted-foreground">
              Caliph World Foundation reserves the right to modify this Refund Policy at any time. Changes will 
              be effective immediately upon posting on our website. The refund policy applicable to your 
              registration will be the one in effect at the time of your registration.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
