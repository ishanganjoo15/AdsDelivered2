import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import CreateCampaign from "@/pages/create-campaign";
import CampaignDetails from "@/pages/campaign-details";
import AdminPage from "@/pages/admin";
import VendorPage from "@/pages/vendor";
import DeliveryChannelPage from "@/pages/partner-earnings";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();

  // Simple redirect to login if at root
  useEffect(() => {
    if (location === "/") {
      setLocation("/login");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/login" component={AuthPage} />
      <Route path="/signup" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/campaigns/new" component={CreateCampaign} />
      <Route path="/campaigns/:id" component={CampaignDetails} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/vendor" component={VendorPage} />
      <Route path="/partner" component={DeliveryChannelPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
