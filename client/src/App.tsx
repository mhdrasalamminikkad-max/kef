import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import StartupSupport from "@/pages/startup-support";
import CampusInitiatives from "@/pages/campus-initiatives";
import Events from "@/pages/events";
import Membership from "@/pages/membership";
import Resources from "@/pages/resources";
import Partners from "@/pages/partners";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/programs" component={Programs} />
        <Route path="/startup-support" component={StartupSupport} />
        <Route path="/campus-initiatives" component={CampusInitiatives} />
        <Route path="/events" component={Events} />
        <Route path="/membership" component={Membership} />
        <Route path="/resources" component={Resources} />
        <Route path="/partners" component={Partners} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="kef-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
