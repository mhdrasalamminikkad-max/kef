import { motion } from "framer-motion";
import { Truck, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ShippingPolicy() {
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
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Shipping and Delivery Policy</h1>
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
              Kerala Economic Forum (KEF) primarily provides services related to entrepreneurship programs, 
              events, workshops, and membership benefits. As our offerings are predominantly service-based 
              and delivered in-person or digitally, this policy outlines how we deliver our services to 
              registered participants.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Service Delivery</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Event and Program Participation</h3>
            <p className="text-muted-foreground mb-4">
              Upon successful registration and payment:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Confirmation Email:</strong> You will receive a registration confirmation email within 24 hours of payment</li>
              <li><strong>Event Details:</strong> Complete event details including venue, schedule, and guidelines will be sent via email and WhatsApp</li>
              <li><strong>Digital ID Card:</strong> A personalized digital ID card/pass will be sent before the event</li>
              <li><strong>Reminders:</strong> Event reminders will be sent 3 days and 1 day before the program</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Physical Event Venues</h3>
            <p className="text-muted-foreground mb-4">
              For in-person programs like Startup Boot Camp:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Venue address and directions will be shared via email</li>
              <li>For residential programs, accommodation details will be provided separately</li>
              <li>Participants are responsible for their own travel to the venue</li>
              <li>Venue changes (if any) will be communicated at least 48 hours in advance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Physical Materials and Merchandise</h2>
            <p className="text-muted-foreground mb-4">
              For any physical items included in registration (kits, certificates, merchandise):
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Event Kits:</strong> Distributed at the event venue during check-in</li>
              <li><strong>Certificates:</strong> Physical certificates (if applicable) are distributed at the event or mailed within 15 business days after program completion</li>
              <li><strong>Membership Cards:</strong> Digital membership cards are sent via email; physical cards (if requested) are mailed within 10 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Shipping of Physical Items</h2>
            <p className="text-muted-foreground mb-4">
              For items that need to be shipped (certificates, membership cards, merchandise):
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Shipping Method:</strong> Items are shipped via India Post or reputed courier services</li>
              <li><strong>Delivery Time:</strong> 7-15 business days within India</li>
              <li><strong>Shipping Cost:</strong> Included in program/membership fee unless specified otherwise</li>
              <li><strong>Address Accuracy:</strong> Participants must provide accurate shipping address during registration</li>
              <li><strong>Tracking:</strong> Tracking details will be shared via email once shipped</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Digital Content Delivery</h2>
            <p className="text-muted-foreground mb-4">
              For digital resources and content:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>E-Certificates:</strong> Sent via email within 7 business days after program completion</li>
              <li><strong>Workshop Materials:</strong> PDF/digital resources shared via email or dedicated portal</li>
              <li><strong>Recordings:</strong> If applicable, session recordings are made available through secure links</li>
              <li><strong>Digital Membership Benefits:</strong> Activated within 24 hours of payment confirmation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Delivery Issues</h2>
            <p className="text-muted-foreground mb-4">
              In case of delivery issues:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Non-receipt:</strong> If you don't receive confirmation within 48 hours, please contact us</li>
              <li><strong>Wrong Address:</strong> Address corrections must be requested before item dispatch</li>
              <li><strong>Lost in Transit:</strong> We will reship items free of charge if lost in transit (proof may be required)</li>
              <li><strong>Damaged Items:</strong> Damaged certificates or materials will be replaced at no cost</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Service Area</h2>
            <p className="text-muted-foreground">
              Our services are currently available throughout India. Events are primarily held in Kerala, 
              with occasional programs in other states. All shipping for physical items is limited to 
              addresses within India. For international participants, only digital deliverables will be provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact for Delivery Issues</h2>
            <p className="text-muted-foreground mb-4">
              For any delivery-related queries or issues, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li><strong>Email:</strong> keralaeconomicforum@gmail.com</li>
              <li><strong>Phone:</strong> +91 9072344431 (WhatsApp available)</li>
              <li><strong>Address:</strong> Level 3, Venture Arcade, Mavoor Rd, above Croma, Thondayad, Kozhikode, Kerala 673016</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Business Hours:</strong> Monday to Saturday, 10:00 AM to 6:00 PM IST
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
