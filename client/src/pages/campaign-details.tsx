import { useState } from "react";
import { Layout } from "@/components/layout";
import { useCampaignStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import { format } from "date-fns";
import NotFound from "./not-found";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CampaignDetails() {
  const [, params] = useRoute("/campaigns/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const campaign = useCampaignStore((state) => state.getCampaign(params?.id || ""));
  const deleteCampaign = useCampaignStore((state) => state.deleteCampaign);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!campaign) {
    return <NotFound />;
  }

  const handleDelete = () => {
    deleteCampaign(campaign.id);
    toast({
      title: "Campaign deleted",
      description: "The campaign has been successfully deleted.",
    });
    setLocation("/dashboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "DRAFT": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "PAUSED": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "ENDED": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="pl-0 gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              <Badge className={getStatusColor(campaign.status)} variant="secondary">
                {campaign.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Campaign running in {campaign.city}
            </p>
          </div>

          <Card className="overflow-hidden border-primary/20 shadow-md">
            <div className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden">
              <img 
                src={campaign.creativeUrl} 
                alt={campaign.name} 
                className="w-full h-full object-contain bg-black/5"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Creative Asset</h3>
              <p className="text-sm text-muted-foreground">
                This creative is currently being displayed on sticker inventory across {campaign.city}.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{campaign.durationDays} Days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(new Date(campaign.startDate), "MMM d")} - {format(new Date(campaign.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                {campaign.launchedAt && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-300">Campaign Launched</p>
                      <p className="text-sm text-green-700 dark:text-green-500">
                        Launched on {format(new Date(campaign.launchedAt), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium">{campaign.city}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">{format(new Date(campaign.startDate), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">{format(new Date(campaign.endDate), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Total Days</span>
                <span className="font-medium">{campaign.durationDays}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{format(new Date(campaign.createdAt), "MMM d, yyyy")}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting this campaign will remove it completely for all users and roles. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4" /> Delete Campaign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete "{campaign.name}"? This action cannot be undone and the campaign will be permanently removed for all roles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
