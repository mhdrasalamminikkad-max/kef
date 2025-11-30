import { motion } from "framer-motion";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Award,
  CheckCircle2,
  Users,
  GraduationCap,
  Building2,
  Building,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertMembershipSchema, type InsertMembership } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const membershipTiers = [
  {
    icon: Users,
    name: "Individual",
    price: "Free",
    description: "For aspiring entrepreneurs and ecosystem enthusiasts",
    features: [
      "Access to community events",
      "Newsletter subscription",
      "Member directory access",
      "Online resources library",
    ],
    popular: false,
  },
  {
    icon: GraduationCap,
    name: "Student",
    price: "Free",
    description: "For students passionate about entrepreneurship",
    features: [
      "All Individual benefits",
      "Campus Ambassador eligibility",
      "Internship opportunities",
      "Student-only events access",
      "Mentorship connections",
    ],
    popular: true,
  },
  {
    icon: Building2,
    name: "Corporate",
    price: "Contact Us",
    description: "For companies supporting the startup ecosystem",
    features: [
      "All Individual benefits",
      "Startup talent access",
      "Event sponsorship opportunities",
      "Innovation partnership programs",
      "Brand visibility across events",
      "CSR collaboration options",
    ],
    popular: false,
  },
  {
    icon: Building,
    name: "Institutional",
    price: "Contact Us",
    description: "For educational and research institutions",
    features: [
      "All Individual benefits",
      "Campus partnership programs",
      "Student engagement initiatives",
      "Faculty development programs",
      "Research collaboration",
      "Incubation setup support",
    ],
    popular: false,
  },
];

const memberBenefits = [
  "Access to exclusive networking events and workshops",
  "Connection to mentors and industry experts",
  "Priority registration for KEF programs",
  "Access to resource library and tools",
  "Member directory for networking",
  "Regular newsletter with ecosystem updates",
  "Volunteer and leadership opportunities",
  "Discounts on partner services",
];

export default function Membership() {
  const { toast } = useToast();
  
  const form = useForm<InsertMembership>({
    resolver: zodResolver(insertMembershipSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      designation: "",
      membershipType: "individual",
      interests: "",
      message: "",
    },
  });

  const membershipMutation = useMutation({
    mutationFn: async (data: InsertMembership) => {
      const response = await apiRequest("POST", "/api/membership", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and get back to you soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMembership) => {
    membershipMutation.mutate(data);
  };

  const scrollToForm = (type: string) => {
    form.setValue("membershipType", type as InsertMembership["membershipType"]);
    document.getElementById('membership-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero
        title="Join Kerala Economic Forum"
        description="Become part of Kerala's most vibrant entrepreneurship community and unlock opportunities for growth and success."
        size="small"
        gradient="teal"
      />

      <Section>
        <SectionHeader
          subtitle="Membership Options"
          title="Choose Your Membership"
          description="Select the membership tier that best fits your needs and goals."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipTiers.map((tier) => (
            <motion.div key={tier.name} variants={itemVariants}>
              <Card className={`h-full relative ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${
                    tier.popular ? 'from-purple-500 to-blue-500' : 'from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                  } flex items-center justify-center`}>
                    <tier.icon className={`w-7 h-7 ${tier.popular ? 'text-white' : 'text-purple-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => scrollToForm(tier.name.toLowerCase())}
                    data-testid={`button-select-${tier.name.toLowerCase()}`}
                  >
                    {tier.price === "Contact Us" ? "Contact Us" : "Join Now"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section background="muted">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Member Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              Why Join KEF?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              As a KEF member, you gain access to a comprehensive support ecosystem designed 
              to help you succeed in your entrepreneurial journey.
            </p>
            <ul className="space-y-3">
              {memberBenefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} id="membership-form">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-foreground">Membership Application</h3>
                <p className="text-muted-foreground">Fill in your details to join the KEF community</p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} data-testid="input-full-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone *</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 XXXXX XXXXX" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="Company/Institution name" {...field} data-testid="input-organization" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="membershipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membership Type *</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              value={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="individual" id="individual" data-testid="radio-individual" />
                                <label htmlFor="individual" className="cursor-pointer text-sm">Individual</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="student" id="student" data-testid="radio-student" />
                                <label htmlFor="student" className="cursor-pointer text-sm">Student</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="corporate" id="corporate" data-testid="radio-corporate" />
                                <label htmlFor="corporate" className="cursor-pointer text-sm">Corporate</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="institutional" id="institutional" data-testid="radio-institutional" />
                                <label htmlFor="institutional" className="cursor-pointer text-sm">Institutional</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areas of Interest *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Tech Startups, Social Enterprise, Funding" {...field} data-testid="input-interests" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us about yourself</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief introduction and what you hope to gain from KEF membership"
                              className="min-h-[100px]"
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg" 
                      disabled={membershipMutation.isPending}
                      data-testid="button-submit-membership"
                    >
                      {membershipMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Award className="mr-2 w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 px-6 lg:px-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Have Questions About Membership?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Our team is happy to answer any questions you have about joining KEF.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-membership-contact">
                  Contact Us
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
