import { Layout } from "@/components/layout";
import { useCampaignStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer, Scissors, Ruler, Info } from "lucide-react";
import { format } from "date-fns";

export default function VendorPage() {
  const campaigns = useCampaignStore((state) => state.campaigns.filter(c => c.status === "LIVE"));

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Print Queue</h1>
        <p className="text-muted-foreground mt-1">Technical specifications and files for sticker production.</p>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-64 bg-muted flex items-center justify-center p-4 border-r">
                <img src={campaign.creativeUrl} alt={campaign.name} className="max-h-40 object-contain shadow-sm rounded bg-white" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2">Campaign ID: {campaign.id}</Badge>
                    <CardTitle className="text-xl">{campaign.name}</CardTitle>
                    <CardDescription>Target: {campaign.city}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" /> Download Assets
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Printer className="h-4 w-4" /> Print Ticket
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Size</p>
                      <p className="font-medium">4" x 4" Circle</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Scissors className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Material</p>
                      <p className="font-medium">Vinyl Matte</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Finish</p>
                      <p className="font-medium">UV Coated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 rounded-full bg-green-500" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Status</p>
                      <p className="font-medium">Ready to Print</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {campaigns.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <Printer className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No pending print jobs</h3>
            <p className="text-muted-foreground">When campaigns are launched, they will appear here for processing.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
