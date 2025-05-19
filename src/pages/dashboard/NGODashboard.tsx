
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
type NGOProfile = Database["public"]["Tables"]["ngo_profiles"]["Row"];

const NGODashboard = () => {
  const { user } = useAuth();
  const [ngoProfile, setNgoProfile] = useState<NGOProfile | null>(null);
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [claimedDonations, setClaimedDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Fetch NGO profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("ngo_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        setNgoProfile(data);
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
        // Fetch available donations (not claimed by any NGO)
        const { data: availableData, error: availableError } = await supabase
          .from("donations")
          .select("*")
          .eq("status", "Available")
          .order("created_at", { ascending: false });
        
        if (availableError) throw availableError;
        
        // Fetch donations claimed by this NGO
        const { data: claimedData, error: claimedError } = await supabase
          .from("donations")
          .select("*")
          .eq("claimed_by", user.id)
          .order("claimed_at", { ascending: false });
        
        if (claimedError) throw claimedError;
        
        setAvailableDonations(availableData || []);
        setClaimedDonations(claimedData || []);
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
  
  // Function to claim a donation
  const claimDonation = async (donationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("donations")
        .update({
          claimed_by: user.id,
          claimed_at: new Date().toISOString(),
          status: "Reserved"
        })
        .eq("id", donationId);
      
      if (error) throw error;
      
      toast({
        title: "Donation claimed",
        description: "You have successfully claimed this donation",
      });
      
      // Refresh donations list
      const updatedAvailable = availableDonations.filter(d => d.id !== donationId);
      const claimedDonation = availableDonations.find(d => d.id === donationId);
      
      if (claimedDonation) {
        const updatedDonation = {
          ...claimedDonation,
          claimed_by: user.id,
          claimed_at: new Date().toISOString(),
          status: "Reserved" as Database["public"]["Enums"]["donation_status"]
        };
        
        setAvailableDonations(updatedAvailable);
        setClaimedDonations([updatedDonation, ...claimedDonations]);
      }
    } catch (error: any) {
      toast({
        title: "Error claiming donation",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Function to mark donation as completed
  const completeDonation = async (donationId: string) => {
    try {
      const { error } = await supabase
        .from("donations")
        .update({
          status: "Completed"
        })
        .eq("id", donationId);
      
      if (error) throw error;
      
      toast({
        title: "Donation completed",
        description: "Thank you for helping make a difference!",
      });
      
      // Update local state
      const updatedDonations = claimedDonations.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: "Completed" as Database["public"]["Enums"]["donation_status"] }
          : donation
      );
      
      setClaimedDonations(updatedDonations);
    } catch (error: any) {
      toast({
        title: "Error updating donation",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!ngoProfile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p>Your NGO profile could not be found or has not been set up yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {ngoProfile.ngo_name}</CardTitle>
            <CardDescription>
              {ngoProfile.status === "Verified" 
                ? "Your NGO account is verified. You can claim donations."
                : ngoProfile.status === "Pending"
                ? "Your account is pending verification. Some features may be limited."
                : "Your account needs attention. Please contact support."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
                <p>{ngoProfile.city}, {ngoProfile.state}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Registration</h3>
                <p>{ngoProfile.registration_number} ({ngoProfile.issuing_authority})</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="available">Available Donations</TabsTrigger>
          <TabsTrigger value="claimed">Claimed Donations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Donations</CardTitle>
              <CardDescription>
                These donations are available to be claimed by your NGO
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : availableDonations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No available donations at the moment.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell className="font-medium">{donation.item_name}</TableCell>
                          <TableCell>{donation.category}</TableCell>
                          <TableCell>{donation.quantity}</TableCell>
                          <TableCell>{donation.city}</TableCell>
                          <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm"
                              onClick={() => claimDonation(donation.id)}
                            >
                              Claim
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="claimed">
          <Card>
            <CardHeader>
              <CardTitle>Your Claimed Donations</CardTitle>
              <CardDescription>
                Donations you have claimed for your NGO
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : claimedDonations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't claimed any donations yet.</p>
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
                        <TableHead>Claimed Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {claimedDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell className="font-medium">{donation.item_name}</TableCell>
                          <TableCell>{donation.category}</TableCell>
                          <TableCell>{donation.quantity}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              donation.status === "Reserved" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : donation.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {donation.status}
                            </span>
                          </TableCell>
                          <TableCell>{donation.claimed_at ? new Date(donation.claimed_at).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell>
                            {donation.status === "Reserved" && (
                              <Button 
                                size="sm"
                                onClick={() => completeDonation(donation.id)}
                              >
                                Mark Completed
                              </Button>
                            )}
                            {donation.status === "Completed" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Add impact note feature (to be implemented)
                                  toast({
                                    title: "Coming Soon",
                                    description: "Add impact notes feature will be available soon!",
                                  });
                                }}
                              >
                                Add Impact
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NGODashboard;
