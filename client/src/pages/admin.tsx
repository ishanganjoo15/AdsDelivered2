import { Layout } from "@/components/layout";
import { useCampaignStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { MoreHorizontal, Play, Pause, Square, UserCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { campaigns, users, updateCampaignStatus } = useCampaignStore();
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: "LIVE" | "PAUSED" | "ENDED") => {
    updateCampaignStatus(id, status);
    toast({
      title: "Status Updated",
      description: `Campaign status changed to ${status}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE": return "bg-green-100 text-green-700 hover:bg-green-100/80";
      case "DRAFT": return "bg-gray-100 text-gray-700 hover:bg-gray-100/80";
      case "PAUSED": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
      case "ENDED": return "bg-red-100 text-red-700 hover:bg-red-100/80";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Advertiser": return "bg-blue-100 text-blue-700";
      case "Print Vendor": return "bg-purple-100 text-purple-700";
      case "Delivery Channel": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground mt-1">Manage all campaigns and onboarded partners across the platform.</p>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="bg-muted/50 border">
          <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
          <TabsTrigger value="users">Onboarded Partners</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img 
                          src={campaign.creativeUrl} 
                          className="h-8 w-12 object-cover rounded bg-muted"
                          alt=""
                        />
                        {campaign.name}
                      </div>
                    </TableCell>
                    <TableCell>{campaign.city}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.durationDays} days</TableCell>
                    <TableCell>{format(new Date(campaign.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "LIVE")}>
                            <Play className="mr-2 h-4 w-4 text-green-600" /> Mark as Live
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "PAUSED")}>
                            <Pause className="mr-2 h-4 w-4 text-yellow-600" /> Pause Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "ENDED")}>
                            <Square className="mr-2 h-4 w-4 text-red-600" /> End Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {campaigns.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No campaigns found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Onboarded Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No partners onboarded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
