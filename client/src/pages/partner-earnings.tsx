import { Layout } from "@/components/layout";
import { useCampaignStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, ShoppingBag, ArrowUpRight } from "lucide-react";

export default function DeliveryPartnerPage() {
  const campaigns = useCampaignStore((state) => state.campaigns).filter(c => c.status === "LIVE");
  
  // Mock commission calculations
  const totalCommission = campaigns.reduce((acc, c) => acc + (c.durationDays * 12.5), 0);
  const totalBags = campaigns.length * 500;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Partner Earnings</h1>
        <p className="text-muted-foreground mt-1">Overview of commissions earned from paper bag sticker placements.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/70">Total Commission</CardDescription>
            <CardTitle className="text-3xl font-bold">₹{totalCommission.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs gap-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paper Bags Tagged</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalBags.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <ShoppingBag className="h-3 w-3" />
              <span>Across {campaigns.length} campaigns</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Campaigns</CardDescription>
            <CardTitle className="text-3xl font-bold">{campaigns.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-green-600 gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>Earning actively</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
          <CardDescription>Commission details per active campaign placement.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Bags Used</TableHead>
                <TableHead className="text-right">Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-muted overflow-hidden">
                        <img src={campaign.creativeUrl} className="h-full w-full object-cover" alt="" />
                      </div>
                      {campaign.name}
                    </div>
                  </TableCell>
                  <TableCell>{campaign.durationDays} days</TableCell>
                  <TableCell>500</TableCell>
                  <TableCell className="text-right font-semibold text-primary">₹{(campaign.durationDays * 12.5).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {campaigns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                    No active earnings to report.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
