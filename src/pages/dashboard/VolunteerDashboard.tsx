
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";

type VolunteerProfile = Database["public"]["Tables"]["volunteer_profiles"]["Row"];
type Donation = Database["public"]["Tables"]["donations"]["Row"] & {
  ngo_name?: string;
};

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile | null>(null);
  const [assignedDeliveries, setAssignedDeliveries] = useState<Donation[]>([]);
  const [availableDeliveries, setAvailableDeliveries] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Fetch volunteer profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("volunteer_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        setVolunteerProfile(data);
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
  
  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user || !volunteerProfile) return;
      
      setLoading(true);
      try {
        // Fetch assigned deliveries
        const { data: assignedData, error: assignedError } = await supabase
          .from("donations")
          .select(`
            *,
            ngo_profiles:claimed_by(ngo_name)
          `)
          .eq("delivery_volunteer_id", user.id)
          .order("updated_at", { ascending: false });
        
        if (assignedError) throw assignedError;
        
        // Format the assigned deliveries with NGO name
        const formattedAssignedDeliveries = assignedData?.map(delivery => ({
          ...delivery,
          ngo_name: delivery.ngo_profiles?.ngo_name,
          ngo_profiles: undefined
        })) || [];
        
        // Fetch available deliveries in same city that need volunteers
        const { data: availableData, error: availableError } = await supabase
          .from("donations")
          .select(`
            *,
            ngo_profiles:claimed_by(ngo_name)
          `)
          .eq("city", volunteerProfile.city)
          .eq("status", "Reserved")
          .is("delivery_volunteer_id", null)
          .not("claimed_by", "is", null)
          .order("updated_at", { ascending: false });
        
        if (availableError) throw availableError;
        
        // Format the available deliveries with NGO name
        const formattedAvailableDeliveries = availableData?.map(delivery => ({
          ...delivery,
          ngo_name: delivery.ngo_profiles?.ngo_name,
          ngo_profiles: undefined
        })) || [];
        
        setAssignedDeliveries(formattedAssignedDeliveries as Donation[]);
        setAvailableDeliveries(formattedAvailableDeliveries as Donation[]);
      } catch (error: any) {
        toast({
          title: "Error fetching deliveries",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (volunteerProfile) {
      fetchDeliveries();
    }
  }, [user, volunteerProfile]);
  
  const toggleAvailability = async (newValue: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("volunteer_profiles")
        .update({ available: newValue })
        .eq("id", user.id);
      
      if (error) throw error;
      
      setVolunteerProfile(prev => prev ? { ...prev, available: newValue } : null);
      
      toast({
        title: newValue ? "You are now available" : "You are now unavailable",
        description: newValue 
          ? "You will be shown available deliveries" 
          : "You won't be shown for new deliveries",
      });
    } catch (error: any) {
      toast({
        title: "Error updating availability",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const acceptDelivery = async (donationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("donations")
        .update({ delivery_volunteer_id: user.id })
        .eq("id", donationId);
      
      if (error) throw error;
      
      // Find the donation and move it from available to assigned
      const donation = availableDeliveries.find(d => d.id === donationId);
      if (donation) {
        const updatedDonation = { ...donation, delivery_volunteer_id: user.id };
        setAvailableDeliveries(availableDeliveries.filter(d => d.id !== donationId));
        setAssignedDeliveries([updatedDonation, ...assignedDeliveries]);
      }
      
      toast({
        title: "Delivery assigned",
        description: "You have accepted this delivery task",
      });
    } catch (error: any) {
      toast({
        title: "Error accepting delivery",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const completeDelivery = async (donationId: string) => {
    try {
      // Mark the delivery as completed
      const { error } = await supabase
        .from("donations")
        .update({ status: "Completed" })
        .eq("id", donationId);
      
      if (error) throw error;
      
      // Update the local state
      setAssignedDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === donationId 
            ? { ...delivery, status: "Completed" as Database["public"]["Enums"]["donation_status"] }
            : delivery
        )
      );
      
      toast({
        title: "Delivery completed",
        description: "Thank you for helping make a difference!",
      });
    } catch (error: any) {
      toast({
        title: "Error completing delivery",
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
  
  if (!volunteerProfile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p>Your volunteer profile could not be found or has not been set up yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {volunteerProfile.name}</CardTitle>
            <CardDescription>
              Thank you for volunteering! Your help makes our mission possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Volunteer Type</h3>
                <div className="mt-1">
                  <Badge variant={volunteerProfile.volunteer_type === "Delivery" ? "default" : "secondary"}>
                    {volunteerProfile.volunteer_type}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
                <p>{volunteerProfile.city}, {volunteerProfile.state}</p>
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <h3 className="font-medium text-sm text-muted-foreground">Availability Status</h3>
                  <p>{volunteerProfile.available ? "Available" : "Unavailable"}</p>
                </div>
                <Switch
                  checked={!!volunteerProfile.available}
                  onCheckedChange={toggleAvailability}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Deliveries</CardTitle>
            <CardDescription>Deliveries you have accepted to transport</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : assignedDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You don't have any assigned deliveries at the moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To NGO</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.item_name}</TableCell>
                        <TableCell>{delivery.pickup_address}</TableCell>
                        <TableCell>{delivery.ngo_name || "Unknown NGO"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            delivery.status === "Completed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {delivery.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {delivery.status !== "Completed" && (
                            <Button 
                              size="sm"
                              onClick={() => completeDelivery(delivery.id)}
                            >
                              Mark Delivered
                            </Button>
                          )}
                          {delivery.status === "Completed" && (
                            <Badge variant="outline">Completed</Badge>
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
        
        {volunteerProfile.volunteer_type === "Delivery" && volunteerProfile.available && (
          <Card>
            <CardHeader>
              <CardTitle>Available Deliveries</CardTitle>
              <CardDescription>Donations that need transportation in your city</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : availableDeliveries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">There are no deliveries available in your area.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To NGO</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableDeliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.item_name}</TableCell>
                          <TableCell>{delivery.pickup_address}</TableCell>
                          <TableCell>{delivery.ngo_name || "Unknown NGO"}</TableCell>
                          <TableCell>Same city</TableCell>
                          <TableCell>
                            <Button 
                              size="sm"
                              onClick={() => acceptDelivery(delivery.id)}
                            >
                              Accept
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
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
