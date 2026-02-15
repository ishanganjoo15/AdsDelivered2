import { Layout } from "@/components/layout";
import { useCampaignStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const campaigns = useCampaignStore((state) => state.campaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE": return "bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400";
      case "DRAFT": return "bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-400";
      case "PAUSED": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "ENDED": return "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your active sticker campaigns.</p>
        </div>
        <Link href="/campaigns/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
            <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50 overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <img
                  src={campaign.creativeUrl}
                  alt={campaign.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge 
                  className={`absolute top-3 right-3 shadow-sm ${getStatusColor(campaign.status)}`}
                  variant="secondary"
                >
                  {campaign.status}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                  {campaign.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {campaign.city}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{campaign.durationDays} days</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">No campaigns found</p>
          <Link href="/campaigns/new">
            <Button variant="outline">Create your first campaign</Button>
          </Link>
        </div>
      )}
    </Layout>
  );
}
