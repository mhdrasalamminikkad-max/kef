import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms and Conditions</h1>
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
            <p className="text-muted-foreground mb-4">
              Welcome to Caliph World Foundation. These Terms and Conditions govern your use of our website 
              and participation in our programs, events, and services operated under Kerala Economic Forum, including 
              the Startup Boot Camp and other initiatives.
            </p>
            <p className="text-muted-foreground">
              By accessing our website or registering for any of our programs, you agree to be bound by these 
              Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Services Offered</h2>
            <p className="text-muted-foreground mb-4">
              Caliph World Foundation provides the following services through Kerala Economic Forum:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Startup Boot Camp - A residential entrepreneurship training program</li>
              <li>Business Conclaves and Networking Events</li>
              <li>Founder Circle Meetings</li>
              <li>Startup Advisory Clinics</li>
              <li>Campus Innovation Labs</li>
              <li>Membership Programs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              To participate in our programs:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>For Startup Boot Camp: Participants must be between 15-35 years of age</li>
              <li>For Membership: Individuals, students, corporates, and institutions are eligible</li>
              <li>Participants must provide accurate and complete registration information</li>
              <li>Participants under 18 years must have parental/guardian consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Registration and Payment</h2>
            <p className="text-muted-foreground mb-4">
              Registration for our programs requires:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Completion of the online registration form with accurate information</li>
              <li>Payment of applicable fees as mentioned during registration</li>
              <li>All payments are processed securely through PhonePe payment gateway</li>
              <li>Registration is confirmed only upon successful payment</li>
              <li>Fees are subject to change without prior notice for future registrations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Payment Terms</h2>
            <p className="text-muted-foreground mb-4">
              All payments are processed through PhonePe, a secure payment gateway. By making a payment, you agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Pay the full registration fee as displayed at the time of registration</li>
              <li>Provide accurate payment information</li>
              <li>PhonePe's terms and conditions apply to all payment transactions</li>
              <li>Transaction fees, if any, are borne by the participant</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Program Participation</h2>
            <p className="text-muted-foreground mb-4">
              Participants agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Attend all sessions and activities as scheduled</li>
              <li>Follow the code of conduct and respect fellow participants</li>
              <li>Not engage in any disruptive or harmful behavior</li>
              <li>Respect intellectual property and confidentiality of shared content</li>
              <li>Comply with venue rules and safety guidelines</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, materials, and resources provided during our programs are the intellectual property 
              of Caliph World Foundation or its partners. Participants may not reproduce, distribute, or use 
              these materials for commercial purposes without prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Caliph World Foundation shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising out of your participation in our programs. Our total liability shall 
              not exceed the amount paid by you for the specific program.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Modifications</h2>
            <p className="text-muted-foreground">
              Caliph World Foundation reserves the right to modify these Terms and Conditions at any time. 
              Changes will be effective immediately upon posting on our website. Continued use of our 
              services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of 
              India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in 
              Kozhikode, Kerala.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For any questions regarding these Terms and Conditions, please contact us:
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
