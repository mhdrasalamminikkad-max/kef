import { useState } from "react";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FloatingInvitationsIcon() {
  const [isOpen, setIsOpen] = useState(false);

  const invitations = [
    {
      id: "1",
      title: "Startup Boot Camp",
      date: "December 26-28, 2025",
      description: "3-Day Residential Experience at Caliph Life School, Kozhikode. Open to ages 15-29.",
      cta: "Register Now",
      link: "/register"
    },
    {
      id: "2",
      title: "Kerala Startup Fest",
      date: "January 2025",
      description: "Two-day festival with 1000+ entrepreneurs, investors, and workshops.",
      cta: "Learn More",
      link: "/programs"
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <Button
        size="icon"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 z-40 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-floating-invitations"
      >
        <div className="relative">
          <Mail className="w-6 h-6 text-white" />
          {invitations.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-yellow-400 text-black border-0">
              {invitations.length}
            </Badge>
          )}
        </div>
      </Button>

      {/* Invitations Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsOpen(false)}
          data-testid="overlay-invitations"
        />
      )}
      
      <div
        className={`fixed bottom-24 right-8 z-50 w-80 max-h-96 transition-all duration-300 transform origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
        data-testid="panel-invitations"
      >
        <Card className="shadow-2xl border-2 border-red-200 dark:border-red-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invitations</CardTitle>
                <CardDescription>Upcoming events & opportunities</CardDescription>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-invitations"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-72 overflow-y-auto">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                data-testid={`card-invitation-${invitation.id}`}
              >
                <h4 className="font-semibold text-sm mb-1">{invitation.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{invitation.date}</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {invitation.description}
                </p>
                <Button
                  size="sm"
                  className="w-full text-xs h-7"
                  asChild
                  data-testid={`button-invitation-${invitation.id}`}
                >
                  <a href={invitation.link}>{invitation.cta}</a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
