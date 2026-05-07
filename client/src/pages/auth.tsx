import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCampaignStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  
  const setCurrentUserRole = useCampaignStore(state => state.setCurrentUserRole);
  const currentUserRole = useCampaignStore(state => state.currentUserRole);
  const onboardUser = useCampaignStore(state => state.onboardUser);
  const setCurrentUserEmail = useCampaignStore(state => state.setCurrentUserEmail);
  const setCurrentUserName = useCampaignStore(state => state.setCurrentUserName);
  const users = useCampaignStore(state => state.users);
  
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Onboarding specific state
  const [name, setName] = useState("");
  const [onboardRole, setOnboardRole] = useState<"Advertiser" | "Print Vendor" | "Delivery Channel">("Advertiser");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      // Handle onboarding
      setIsLoading(true);
      setTimeout(() => {
        onboardUser({
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          password,
          role: onboardRole,
          createdAt: new Date().toISOString(),
        });
        setIsLoading(false);
        setIsLogin(true);
        toast({
          title: "Onboarding successful!",
          description: "Your account has been created. You can now log in.",
        });
        // Clear onboarding fields
        setName("");
        setEmail("");
        setPassword("");
      }, 1000);
      return;
    }

    // Handle Login
    let isValid = false;
    let userName = "";
    
    // Check against onboarded users
    const foundUser = users.find(u => u.email === email && u.password === password && u.role === currentUserRole);
    if (foundUser) {
      isValid = true;
      userName = foundUser.name;
    } else if (currentUserRole === "Admin" && email === "admin@adsdelivered.com" && password === "adminpass123") {
      isValid = true;
      userName = "System Admin";
    }

    if (!isValid) {
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password for the selected role.",
        variant: "destructive",
      });
      return;
    }

    setCurrentUserEmail(email);
    setCurrentUserName(userName);
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setIsLoading(false);
      if (currentUserRole === "Advertiser") setLocation("/dashboard");
      else if (currentUserRole === "Print Vendor") setLocation("/vendor");
      else if (currentUserRole === "Delivery Channel") setLocation("/dashboard");
      else if (currentUserRole === "Admin") setLocation("/admin");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg mb-4 shadow-sm">
            <span className="text-2xl font-bold tracking-tight">AdsDelivered</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center">
            {isLogin ? "Welcome back" : "Partner Onboarding"}
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            {isLogin
              ? "Enter your credentials to access your campaigns"
              : "Join our platform as a new partner"}
          </p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardContent className="pt-6">
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="onboard-role">I want to join as</Label>
                    <Select value={onboardRole} onValueChange={(val: any) => setOnboardRole(val)}>
                      <SelectTrigger id="onboard-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Advertiser">Advertiser</SelectItem>
                        <SelectItem value="Print Vendor">Print Vendor</SelectItem>
                        <SelectItem value="Delivery Channel">Delivery Channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Company / Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Acme Corp"
                      required
                      className="bg-background"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </>
              )}

              {isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="role">Login Role</Label>
                  <Select value={currentUserRole} onValueChange={(val: any) => setCurrentUserRole(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Advertiser">Advertiser Login</SelectItem>
                      <SelectItem value="Print Vendor">Print Vendor Login</SelectItem>
                      <SelectItem value="Delivery Channel">Delivery Channel Login</SelectItem>
                      <SelectItem value="Admin">Admin Login</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-background" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "Sign In" : "Complete Onboarding"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-muted/20 py-4">
            <Button
              variant="link"
              className="px-0 text-muted-foreground"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
              }}
            >
              {isLogin
                ? "New here? Start Onboarding"
                : "Already onboarded? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
