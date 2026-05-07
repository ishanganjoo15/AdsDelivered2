import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Settings, LogOut, Shield, Printer, Wallet } from "lucide-react";
import { useCampaignStore } from "@/lib/store";

export function Sidebar() {
  const [location] = useLocation();
  const currentUserRole = useCampaignStore(state => state.currentUserRole);
  const currentUserEmail = useCampaignStore(state => state.currentUserEmail);
  const currentUserName = useCampaignStore(state => state.currentUserName);
  const users = useCampaignStore(state => state.users);

  const displayUserName = currentUserName || users.find(u => u.email === currentUserEmail && u.role === currentUserRole)?.name || (currentUserRole === "Admin" ? "System Admin" : currentUserRole);

  const allLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Advertiser", "Delivery Channel", "Admin"] },
    { href: "/campaigns/new", label: "New Campaign", icon: PlusCircle, roles: ["Advertiser", "Admin"] },
    { href: "/admin", label: "Admin View", icon: Shield, roles: ["Admin"] },
    { href: "/vendor", label: "Vendor Queue", icon: Printer, roles: ["Print Vendor", "Admin"] },
    { href: "/partner", label: "Channel Earnings", icon: Wallet, roles: ["Delivery Channel", "Admin"] },
  ];

  const links = allLinks.filter(link => link.roles.includes(currentUserRole));

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            S
          </div>
          AdsDelivered
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {displayUserName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayUserName}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {currentUserEmail || (currentUserRole === "Advertiser" ? "adv@adsdelivered.com" :
               currentUserRole === "Print Vendor" ? "print@adsdelivered.com" :
               currentUserRole === "Delivery Channel" ? "channel@adsdelivered.com" :
               "admin@adsdelivered.com")}
            </span>
          </div>
        </div>
        <Link href="/login">
          <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="h-4 w-4" />
            Sign Out
          </div>
        </Link>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
