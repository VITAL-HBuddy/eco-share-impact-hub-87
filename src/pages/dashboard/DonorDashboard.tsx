
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";

type Donation = Database["public"]["Tables"]["donations"]["Row"];
type DonorProfile = Database["public"]["Tables"]["donor_profiles"]["Row"];

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Fetch donor profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("donor_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        setDonorProfile(data);
      } catch (error: any) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("donor_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setDonations(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching donations",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonations();
  }, [user]);
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-blue-100 text-blue-800";
      case "Reserved":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!donorProfile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p>Your donor profile could not be found or has not been set up yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {donorProfile.name}</CardTitle>
            <CardDescription>
              Thank you for being a part of the EcoShare community! Your donations make a real difference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
                <p>{donorProfile.city}, {donorProfile.state}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Type</h3>
                <p>{donorProfile.donor_type}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Total Donations</h3>
                <p>{donations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Donations</h2>
        <Button>Add New Donation</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>
            Track the status of all your donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="reserved">Reserved</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {["all", "available", "reserved", "completed"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue}>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations
                          .filter(donation => 
                            tabValue === "all" || 
                            donation.status.toLowerCase() === tabValue
                          )
                          .map((donation) => (
                            <TableRow key={donation.id}>
                              <TableCell className="font-medium">{donation.item_name}</TableCell>
                              <TableCell>{donation.category}</TableCell>
                              <TableCell>{donation.quantity}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(donation.status)}`}>
                                  {donation.status}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">View Details</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        
                        {donations.filter(donation => 
                          tabValue === "all" || 
                          donation.status.toLowerCase() === tabValue
                        ).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No {tabValue === "all" ? "" : tabValue} donations found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDashboard;
