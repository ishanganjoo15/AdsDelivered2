import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Campaign {
  id: string;
  name: string;
  city: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  creativeUrl: string;
  deliveryPartner?: string;
  status: "DRAFT" | "LIVE" | "PAUSED" | "ENDED";
  createdAt: string;
  launchedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "Advertiser" | "Print Vendor" | "Delivery Channel";
  createdAt: string;
}

interface CampaignState {
  campaigns: Campaign[];
  users: User[];
  currentUserRole: "Advertiser" | "Print Vendor" | "Delivery Channel" | "Admin";
  addCampaign: (campaign: Campaign) => void;
  updateCampaignStatus: (id: string, status: Campaign["status"]) => void;
  deleteCampaign: (id: string) => void;
  getCampaign: (id: string) => Campaign | undefined;
  setCurrentUserRole: (role: "Advertiser" | "Print Vendor" | "Delivery Channel" | "Admin") => void;
  onboardUser: (user: User) => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [
        {
          id: "1",
          name: "Summer Sale Blimp",
          city: "Bengaluru",
          startDate: "2024-06-01",
          endDate: "2024-06-30",
          durationDays: 30,
          creativeUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60",
          status: "LIVE",
          createdAt: "2024-05-15T10:00:00Z",
          launchedAt: "2024-05-30T09:00:00Z",
        },
        {
          id: "2",
          name: "Tech Conf 2024",
          city: "Mumbai",
          startDate: "2024-11-10",
          endDate: "2024-11-15",
          durationDays: 6,
          creativeUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60",
          status: "DRAFT",
          createdAt: "2024-02-20T14:30:00Z",
        }
      ],
      users: [
        {
          id: "u1",
          name: "Acme Corp",
          email: "adv@adsdelivered.com",
          password: "advpass123",
          role: "Advertiser",
          createdAt: "2024-01-10T10:00:00Z",
        },
        {
          id: "u2",
          name: "Rapid Print",
          email: "print@adsdelivered.com",
          password: "printpass123",
          role: "Print Vendor",
          createdAt: "2024-01-12T11:00:00Z",
        },
        {
          id: "u3",
          name: "Fast Delivery Co",
          email: "channel@adsdelivered.com",
          password: "channelpass123",
          role: "Delivery Channel",
          createdAt: "2024-01-15T09:00:00Z",
        }
      ],
      currentUserRole: "Advertiser",
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),
      updateCampaignStatus: (id, status) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        })),
      deleteCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),
      getCampaign: (id) => get().campaigns.find((c) => c.id === id),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
      onboardUser: (user) => 
        set((state) => ({ users: [...state.users, user] })),
    }),
    {
      name: "campaign-storage",
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
