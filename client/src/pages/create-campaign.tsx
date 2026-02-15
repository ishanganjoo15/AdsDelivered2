import { useState } from "react";
import { Layout } from "@/components/layout";
import { useCampaignStore } from "@/lib/store";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format, differenceInDays, addDays } from "date-fns";
import { CalendarIcon, UploadCloud, Rocket, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai"];

const formSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  city: z.string().min(1, "Please select a city"),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).refine((data) => data.from && data.to, "Please select a start and end date"),
  creative: z.any().optional(), // We'll handle file validation manually for simplicity in this mockup
});

export default function CreateCampaign() {
  const [, setLocation] = useLocation();
  const addCampaign = useCampaignStore((state) => state.addCampaign);
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [pendingData, setPendingData] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Max file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!previewUrl) {
      toast({
        title: "Creative required",
        description: "Please upload a creative image for your campaign",
        variant: "destructive",
      });
      return;
    }
    setPendingData(values);
    setShowLaunchModal(true);
  };

  const handleLaunch = async () => {
    if (!pendingData || !previewUrl) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const startDate = pendingData.dateRange.from;
    const endDate = pendingData.dateRange.to;
    const durationDays = differenceInDays(endDate, startDate) + 1;

    const newCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: pendingData.name,
      city: pendingData.city,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      durationDays,
      creativeUrl: previewUrl,
      status: "LIVE" as const,
      createdAt: new Date().toISOString(),
      launchedAt: new Date().toISOString(),
    };

    addCampaign(newCampaign);
    
    toast({
      title: "Campaign Launched!",
      description: `Your campaign in ${pendingData.city} is now live.`,
    });

    setIsSubmitting(false);
    setShowLaunchModal(false);
    setLocation(`/campaigns/${newCampaign.id}`);
  };

  const dateRange = form.watch("dateRange");
  const durationDays = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) + 1 
    : 0;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Campaign</h1>
          <p className="text-muted-foreground">
            Configure your sticker campaign details, upload creative, and launch.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Sale 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Duration {durationDays > 0 && <span className="text-primary ml-1">({durationDays} Days)</span>}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label>Creative Asset</Label>
                <div className="border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors text-center cursor-pointer relative overflow-hidden group">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                  />
                  {previewUrl ? (
                    <div className="relative aspect-video w-full h-48 mx-auto bg-muted rounded-md overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                        Click to change
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or WEBP (max. 10MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setLocation("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" size="lg" className="px-8">
                Launch Campaign <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Dialog open={showLaunchModal} onOpenChange={setShowLaunchModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Launch</DialogTitle>
            <DialogDescription>
              Are you sure you want to launch this campaign?
            </DialogDescription>
          </DialogHeader>
          
          {pendingData && (
            <div className="py-4 space-y-3">
              <div className="bg-muted p-4 rounded-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Campaign:</span>
                  <span className="font-medium">{pendingData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{pendingData.city}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {differenceInDays(pendingData.dateRange.to, pendingData.dateRange.from) + 1} Days
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLaunchModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleLaunch} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Launching..." : "Yes, Launch Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
