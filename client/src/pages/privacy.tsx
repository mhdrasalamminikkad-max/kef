import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Privacy() {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
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
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Caliph World Foundation ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
              Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website or participate in our programs and services operated under Kerala Economic Forum.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Full name and age</li>
              <li>Email address and phone number</li>
              <li>Residential address and district</li>
              <li>Organization/Institution name</li>
              <li>Profile photograph (for registration purposes)</li>
              <li>Payment information (processed securely through PhonePe)</li>
            </ul>
            <h3 className="text-xl font-semibold text-foreground mb-3">Program-Related Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Prior entrepreneurship experience</li>
              <li>Expectations from our programs</li>
              <li>Membership type preferences</li>
              <li>Areas of interest</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Processing program registrations and payments</li>
              <li>Communicating about program details, schedules, and updates</li>
              <li>Sending event invitations and newsletters (with your consent)</li>
              <li>Creating participant ID cards and certificates</li>
              <li>Improving our services and user experience</li>
              <li>Complying with legal obligations</li>
              <li>Responding to inquiries and providing support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Payment Information</h2>
            <p className="text-muted-foreground">
              All payment transactions are processed through PhonePe, a secure third-party payment gateway. 
              We do not store your complete payment card details on our servers. PhonePe's privacy policy 
              and security measures apply to all payment transactions. We only receive transaction confirmation 
              and reference numbers for record-keeping purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Storage and Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Secure database storage with encryption</li>
              <li>Access controls limiting data access to authorized personnel only</li>
              <li>Regular security assessments and updates</li>
              <li>Secure HTTPS connections for all data transmission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>With your explicit consent</li>
              <li>With program partners and mentors (limited to program-relevant information)</li>
              <li>With payment processors (PhonePe) for transaction processing</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights, privacy, safety, or property</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              Our website may use cookies and similar tracking technologies to enhance your browsing experience. 
              These are used for session management, remembering preferences, and analytics. You can control 
              cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground">
              For participants under 18 years of age, we require parental or guardian consent for registration. 
              Parents/guardians have the right to review, modify, or request deletion of their child's information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li><strong>Organization:</strong> Caliph World Foundation</li>
              <li><strong>Email:</strong> keralaeconomicforum@gmail.com</li>
              <li><strong>Phone:</strong> +91 9072344431</li>
              <li><strong>Address:</strong> Level 3, Venture Arcade, Mavoor Rd, above Croma, Thondayad, Kozhikode, Kerala 673016</li>
            </ul>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
