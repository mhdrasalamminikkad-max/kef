import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { RegistrationProvider } from "@/contexts/registration-context";
import { Layout } from "@/components/layout";
import { useSecretCode } from "@/hooks/use-secret-code";

import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import Membership from "@/pages/membership";
import Partners from "@/pages/partners";
import Contact from "@/pages/contact";
import Register from "@/pages/register";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/programs" component={Programs} />
            <Route path="/membership" component={Membership} />
            <Route path="/partners" component={Partners} />
            <Route path="/contact" component={Contact} />
            <Route path="/register" component={Register} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function SecretCodeListener({ children }: { children: React.ReactNode }) {
  useSecretCode();
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="kef-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RegistrationProvider>
            <SecretCodeListener>
              <Router />
            </SecretCodeListener>
            <Toaster />
          </RegistrationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
