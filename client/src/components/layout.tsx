import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Settings, LogOut, Shield, Printer, Wallet } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/campaigns/new", label: "New Campaign", icon: PlusCircle },
    { href: "/admin", label: "Admin View", icon: Shield },
    { href: "/vendor", label: "Vendor Queue", icon: Printer },
    { href: "/partner", label: "Partner Earnings", icon: Wallet },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            S
          </div>
          StickerMgr
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
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Advertiser</span>
            <span className="text-xs text-muted-foreground">demo@ad.com</span>
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
