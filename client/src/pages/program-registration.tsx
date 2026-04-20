import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Section } from "@/components/section";
import { ArrowRight } from "lucide-react";
import type { Program } from "@shared/schema";

interface ProgramRegistrationPageProps {
  programId?: string;
}

export default function ProgramRegistrationPage({ programId }: ProgramRegistrationPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedProgramId, setSelectedProgramId] = useState(programId || "");
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    countryCode: "+91",
    company: "",
    designation: "",
    isMember: false,
    membershipNumber: "",
  });

  // Fetch all live programs
  const { data: allPrograms } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Filter live programs, excluding Head Talks 1.3 (has external registration)
  const livePrograms = allPrograms?.filter(p => p.programStatus === 'live' && p.title !== 'Head Talks 1.3') || [];

  // Fetch selected program details
  const programQuery = useQuery({
    queryKey: [`/api/programs/${selectedProgramId}`],
    enabled: !!selectedProgramId,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!selectedProgramId) {
        throw new Error("Please select a program");
      }
      const response = await apiRequest("POST", "/api/program-registrations", {
        ...data,
        programId: selectedProgramId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have successfully registered for this program!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for the program",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) {
      toast({
        title: "Error",
        description: "Please select a program",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(formData);
  };

  const program = programQuery.data as any;

  // Redirect to external registration link for Head Talks 1.3
  useEffect(() => {
    if (program && program.title === 'Head Talks 1.3') {
      window.location.href = 'https://wkf.ms/4a8ALEW';
    }
  }, [program]);

  return (
    <Section className="py-12">
      <div className="max-w-2xl mx-auto">
        {program && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
            <p className="text-muted-foreground">{program.description}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Register for Program</CardTitle>
            <CardDescription>Please fill in your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Program Selection */}
              <div className="space-y-2">
                <Label htmlFor="program">
                  Select Program <span className="text-red-500">*</span>
                </Label>
                <select
                  id="program"
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">Choose a live program...</option>
                  {livePrograms.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.title}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">
                  Select the program you want to register for
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  maxLength={255}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This will be used to identify you during the event.
                </p>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  We will use this to send you event updates and notifications.
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData({ ...formData, countryCode: e.target.value })
                    }
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="+91">(+91) India</option>
                  </select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Please provide your phone number. We may need to contact you regarding event details.
                </p>
              </div>

              {/* Company / Professional */}
              <div className="space-y-2">
                <Label htmlFor="company">Company / Organisation</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company or organisation"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  min="1"
                  max="120"
                />
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  type="text"
                  placeholder="Your designation/job title"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>

              {/* KEF Member */}
              <div className="space-y-3">
                <Label>Are you a KEF Member? <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formData.isMember ? "yes" : "no"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isMember: value === "yes" })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="member-yes" />
                    <Label htmlFor="member-yes" className="cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="member-no" />
                    <Label htmlFor="member-no" className="cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Membership Number (Conditional) */}
              {formData.isMember && (
                <div className="space-y-2">
                  <Label htmlFor="membershipNumber">Membership Number</Label>
                  <Input
                    id="membershipNumber"
                    type="text"
                    placeholder="Enter your KEF membership number"
                    value={formData.membershipNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, membershipNumber: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
                size="lg"
              >
                {registerMutation.isPending ? (
                  "Registering..."
                ) : (
                  <>
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
