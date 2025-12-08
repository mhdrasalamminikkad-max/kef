import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { RegistrationProvider } from "@/contexts/registration-context";
import { Layout } from "@/components/layout";
import { useSecretCode } from "@/hooks/use-secret-code";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ScrollProgress, Spotlight } from "@/components/animations";
import { useEffect } from "react";

import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import ProgramDetail from "@/pages/program-detail";
import Membership from "@/pages/membership";
import Partners from "@/pages/partners";
import Contact from "@/pages/contact";
import Register from "@/pages/register";
import Invitation from "@/pages/invitation";
import PaymentStatus from "@/pages/payment-status";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import RefundPolicy from "@/pages/refund-policy";
import ShippingPolicy from "@/pages/shipping-policy";
import Verify from "@/pages/verify";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route path="/invitation/:id" component={Invitation} />
        <Route path="/verify/:id" component={Verify} />
        <Route path="/payment-status/:merchantTransactionId" component={PaymentStatus} />
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/programs" component={Programs} />
              <Route path="/programs/:id" component={ProgramDetail} />
              <Route path="/membership" component={Membership} />
              <Route path="/partners" component={Partners} />
              <Route path="/contact" component={Contact} />
              <Route path="/register" component={Register} />
              <Route path="/terms" component={Terms} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/refund-policy" component={RefundPolicy} />
              <Route path="/shipping-policy" component={ShippingPolicy} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </>
  );
}

function SecretCodeListener({ children }: { children: React.ReactNode }) {
  useSecretCode();
  return <>{children}</>;
}

function PopupPrefetcher() {
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["/api/popup-settings"],
      staleTime: 1000 * 60 * 5,
    });
  }, []);
  return null;
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="kef-theme">
      <QueryClientProvider client={queryClient}>
        <PopupPrefetcher />
        <ScrollProgress />
        <Spotlight className="hidden lg:block" />
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
