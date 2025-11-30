import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Filter
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { EventCard } from "@/components/event-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  {
    title: "Startup Kerala Summit 2024",
    date: "Dec 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Technopark, Thiruvananthapuram",
    description: "Annual flagship event bringing together the startup ecosystem for networking, learning, and collaboration. Features keynotes, panel discussions, and startup expo.",
    category: "Summit",
  },
  {
    title: "Investor Connect Program",
    date: "Dec 20, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Kochi Startup Village",
    description: "Exclusive pitch session connecting promising startups with angel investors and venture capitalists for funding opportunities.",
    category: "Networking",
  },
  {
    title: "Entrepreneurship Bootcamp",
    date: "Jan 5, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Virtual Event",
    description: "Intensive workshop covering business model development, market validation, and growth strategies for aspiring entrepreneurs.",
    category: "Workshop",
  },
  {
    title: "Women Founders Meetup",
    date: "Jan 12, 2025",
    time: "3:00 PM - 6:00 PM",
    location: "Kochi",
    description: "Monthly networking event for women entrepreneurs to connect, share experiences, and support each other's journeys.",
    category: "Networking",
  },
  {
    title: "Tech Startup Showcase",
    date: "Jan 20, 2025",
    time: "11:00 AM - 5:00 PM",
    location: "Technopark, Thiruvananthapuram",
    description: "Exhibition featuring innovative tech startups from Kerala showcasing their products and solutions to potential partners and customers.",
    category: "Expo",
  },
  {
    title: "Funding Masterclass",
    date: "Feb 1, 2025",
    time: "10:00 AM - 1:00 PM",
    location: "Virtual Event",
    description: "Learn the art of fundraising from successful founders and investors. Topics include pitch deck creation, valuation, and negotiation.",
    category: "Workshop",
  },
];

const pastEvents = [
  {
    title: "Startup Kerala Summit 2023",
    date: "Dec 2023",
    location: "Technopark",
    attendees: "1200+",
    description: "The largest gathering of Kerala's startup ecosystem with keynotes, panels, and networking.",
  },
  {
    title: "Global Startup Connect",
    date: "Oct 2023",
    location: "Virtual",
    attendees: "500+",
    description: "Virtual event connecting Kerala startups with international investors and partners.",
  },
  {
    title: "Campus Innovation Challenge",
    date: "Sep 2023",
    location: "Multiple Venues",
    attendees: "800+",
    description: "Inter-college competition identifying and nurturing student entrepreneurs.",
  },
];

const eventCategories = ["All", "Summit", "Workshop", "Networking", "Expo", "Hackathon"];

export default function Events() {
  return (
    <>
      <Hero
        title="Events"
        description="Join our events to learn, connect, and grow with Kerala's vibrant entrepreneurial community."
        size="small"
        gradient="purple"
      />

      <Section>
        <SectionHeader
          subtitle="Upcoming Events"
          title="Mark Your Calendar"
          description="Don't miss these opportunities to connect with the ecosystem and accelerate your journey."
        />
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
          {eventCategories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {upcomingEvents.map((event, index) => (
            <EventCard
              key={event.title}
              {...event}
              index={index}
            />
          ))}
        </div>
        
        <motion.div variants={itemVariants} className="text-center mt-12">
          <Button variant="outline" size="lg" data-testid="button-load-more-events">
            Load More Events
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </Section>

      <Section background="muted">
        <SectionHeader
          subtitle="Past Events"
          title="Event Highlights"
          description="Revisit some of our impactful events from the past."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEvents.map((event, index) => (
            <motion.div key={event.title} variants={itemVariants}>
              <Card className="h-full hover-elevate">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4">{event.date}</Badge>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Host an Event
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              Partner With Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Interested in organizing an event with KEF? We partner with organizations, 
              institutions, and individuals to create impactful events that benefit the 
              entrepreneurial ecosystem.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Event Support</h4>
                  <p className="text-sm text-muted-foreground">We help plan and execute entrepreneurship events</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Speaker Network</h4>
                  <p className="text-sm text-muted-foreground">Access to industry experts and thought leaders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Venue Access</h4>
                  <p className="text-sm text-muted-foreground">Connections to startup hubs and event spaces</p>
                </div>
              </div>
            </div>
            <Link href="/contact">
              <Button size="lg" data-testid="button-events-partner">
                Propose an Event
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center p-8">
              <div className="text-center">
                <Calendar className="w-20 h-20 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-bold text-foreground mb-2">50+ Events Annually</h3>
                <p className="text-muted-foreground">Workshops, summits, networking events, and more</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section background="gradient">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 px-6 lg:px-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Never Miss an Event
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and get notified about upcoming events, workshops, and networking opportunities.
              </p>
              <Link href="/membership">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-events-subscribe">
                  Subscribe Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
