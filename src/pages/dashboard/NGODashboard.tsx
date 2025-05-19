
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, UserCheck, ShoppingBag, Star, MessageSquare, TrendingUp, Calendar } from "lucide-react";

// Types
type Donation = {
  id: string;
  item_name: string;
  description: string;
  category: string;
  quantity: number;
  expiry_date: string | null;
  pickup_address: string;
  city: string;
  state: string;
  photo_url: string | null;
  status: string;
  donor: {
    name: string;
    donor_type: string;
  };
  created_at: string;
};

type NeedListItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity_needed: number;
  fulfilled_quantity: number;
  deadline: string | null;
};

const NGODashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [acceptedDonations, setAcceptedDonations] = useState<Donation[]>([]);
  const [needsList, setNeedsList] = useState<NeedListItem[]>([]);
  
  // Filter states
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // Form states for needs posting
  const [needTitle, setNeedTitle] = useState("");
  const [needDescription, setNeedDescription] = useState("");
  const [needCategory, setNeedCategory] = useState("Food");
  const [needQuantity, setNeedQuantity] = useState(1);
  const [needDeadline, setNeedDeadline] = useState("");
  
  // Analytics
  const [analyticsData, setAnalyticsData] = useState({
    totalReceived: 0,
    thisMonth: 0,
    topDonors: [] as {id: string, name: string, count: number}[]
  });

  useEffect(() => {
    if (user) {
      fetchAvailableDonations();
      fetchAcceptedDonations();
      fetchNeedsList();
      fetchAnalytics();
    }
  }, [user]);

  const fetchAvailableDonations = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('donations')
        .select(`
          *,
          donor:donor_id (
            name,
            donor_type
          )
        `)
        .eq('status', 'Available');
      
      if (cityFilter) {
        query = query.eq('city', cityFilter);
      }
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      if (dateFilter) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (dateFilter === 'today') {
          query = query.gte('created_at', today.toISOString().split('T')[0]);
          query = query.lt('created_at', tomorrow.toISOString().split('T')[0]);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Could not load available donations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donor:donor_id (
            name,
            donor_type
          )
        `)
        .eq('claimed_by', user?.id)
        .order('claimed_at', { ascending: false });
      
      if (error) throw error;
      setAcceptedDonations(data || []);
    } catch (error) {
      console.error('Error fetching accepted donations:', error);
    }
  };

  const fetchNeedsList = async () => {
    try {
      const { data, error } = await supabase
        .from('ngo_needs')
        .select('*')
        .eq('ngo_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNeedsList(data || []);
    } catch (error) {
      console.error('Error fetching needs list:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Total received
      const { count: totalCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .eq('claimed_by', user?.id);
      
      // This month
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { count: monthlyCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .eq('claimed_by', user?.id)
        .gte('claimed_at', firstDayOfMonth.toISOString());
      
      // Top donors
      const { data: topDonorsData } = await supabase
        .from('donations')
        .select(`
          donor_id,
          donor:donor_id (
            name
          )
        `)
        .eq('claimed_by', user?.id);
      
      const donorCounts = {} as Record<string, {id: string, name: string, count: number}>;
      
      topDonorsData?.forEach(item => {
        if (item.donor_id) {
          if (!donorCounts[item.donor_id]) {
            donorCounts[item.donor_id] = { 
              id: item.donor_id, 
              name: item.donor?.name || 'Unknown', 
              count: 0 
            };
          }
          donorCounts[item.donor_id].count++;
        }
      });
      
      const topDonors = Object.values(donorCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      setAnalyticsData({
        totalReceived: totalCount || 0,
        thisMonth: monthlyCount || 0,
        topDonors
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };
  
  const acceptDonation = async (donationId: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          claimed_by: user?.id,
          claimed_at: new Date().toISOString(),
          status: 'Reserved'
        })
        .eq('id', donationId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Donation accepted successfully!",
      });
      
      fetchAvailableDonations();
      fetchAcceptedDonations();
      fetchAnalytics();
    } catch (error) {
      console.error('Error accepting donation:', error);
      toast({
        title: "Error",
        description: "Could not accept donation",
        variant: "destructive",
      });
    }
  };
  
  const requestVolunteer = async (donationId: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          claimed_by: user?.id,
          claimed_at: new Date().toISOString(),
          status: 'Reserved',
          delivery_volunteer_id: null // This will be filled when a volunteer accepts
        })
        .eq('id', donationId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Volunteer request sent! You will be notified when someone accepts.",
      });
      
      fetchAvailableDonations();
      fetchAcceptedDonations();
    } catch (error) {
      console.error('Error requesting volunteer:', error);
      toast({
        title: "Error",
        description: "Could not request volunteer",
        variant: "destructive",
      });
    }
  };
  
  const postNeed = async () => {
    try {
      if (!needTitle || !needDescription || !needCategory || needQuantity < 1) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('ngo_needs')
        .insert({
          ngo_id: user?.id,
          title: needTitle,
          description: needDescription,
          category: needCategory,
          quantity_needed: needQuantity,
          deadline: needDeadline || null,
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Need posted successfully!",
      });
      
      // Clear form
      setNeedTitle("");
      setNeedDescription("");
      setNeedCategory("Food");
      setNeedQuantity(1);
      setNeedDeadline("");
      
      fetchNeedsList();
    } catch (error) {
      console.error('Error posting need:', error);
      toast({
        title: "Error",
        description: "Could not post need",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">NGO Dashboard</h1>
      
      <Tabs defaultValue="donations" className="space-y-8">
        <TabsList className="w-full border-b">
          <TabsTrigger value="donations" className="flex-1">Donation Feed</TabsTrigger>
          <TabsTrigger value="accepted" className="flex-1">Accepted Donations</TabsTrigger>
          <TabsTrigger value="needs" className="flex-1">Announcements & Requests</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
        </TabsList>
        
        {/* DONATION FEED TAB */}
        <TabsContent value="donations" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Available Donations</h2>
            
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Clothes">Clothes</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Toys">Toys</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={fetchAvailableDonations}>
                Apply Filters
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : donations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <Card key={donation.id} className="overflow-hidden">
                  {donation.photo_url ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={donation.photo_url} 
                        alt={donation.item_name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                  
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        donation.category === 'Food' ? 'default' :
                        donation.category === 'Clothes' ? 'secondary' :
                        donation.category === 'Books' ? 'outline' :
                        'default'
                      }>
                        {donation.category}
                      </Badge>
                      
                      <span className="text-xs text-muted-foreground">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg mt-2">{donation.item_name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {donation.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <UserCheck className="w-4 h-4 mr-2" />
                        <span>{donation.donor.name} ({donation.donor.donor_type})</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{donation.city}, {donation.state}</span>
                      </div>
                      
                      {donation.expiry_date && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Expires: {new Date(donation.expiry_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => acceptDonation(donation.id)}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="secondary"
                      className="flex-1"
                      onClick={() => requestVolunteer(donation.id)}
                    >
                      Request Pickup
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No available donations found</h3>
              <p className="text-muted-foreground">
                Check back later or adjust your filters to see more donations
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* ACCEPTED DONATIONS TAB */}
        <TabsContent value="accepted" className="space-y-6">
          <h2 className="text-xl font-semibold">Your Accepted Donations</h2>
          
          {acceptedDonations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedDonations.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge>{donation.category}</Badge>
                      <Badge variant="outline">{donation.status}</Badge>
                    </div>
                    <CardTitle className="mt-2">{donation.item_name}</CardTitle>
                    <CardDescription>{donation.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <UserCheck className="w-4 h-4 mr-2" />
                        <span>{donation.donor.name}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{donation.pickup_address}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Claimed on: {new Date(donation.claimed_at || "").toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Donor
                    </Button>
                    <Button variant="secondary" className="flex-1 ml-2">
                      <Star className="w-4 h-4 mr-2" />
                      Add Review
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No accepted donations yet</h3>
              <p className="text-muted-foreground">
                Browse the donation feed to find and accept donations
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* NEEDS & ANNOUNCEMENTS TAB */}
        <TabsContent value="needs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Post new need */}
            <Card>
              <CardHeader>
                <CardTitle>Post a New Request</CardTitle>
                <CardDescription>
                  Let donors know what your organization needs
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="need-title" className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <Input
                    id="need-title"
                    placeholder="e.g., 50 blankets needed"
                    value={needTitle}
                    onChange={(e) => setNeedTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="need-description" className="block text-sm font-medium mb-1">
                    Description *
                  </label>
                  <textarea
                    id="need-description"
                    className="w-full rounded-md border border-input p-2"
                    rows={3}
                    placeholder="Provide details about your request"
                    value={needDescription}
                    onChange={(e) => setNeedDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="need-category" className="block text-sm font-medium mb-1">
                      Category *
                    </label>
                    <Select value={needCategory} onValueChange={setNeedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Clothes">Clothes</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Toys">Toys</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="need-quantity" className="block text-sm font-medium mb-1">
                      Quantity Needed *
                    </label>
                    <Input
                      id="need-quantity"
                      type="number"
                      min="1"
                      value={needQuantity}
                      onChange={(e) => setNeedQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="need-deadline" className="block text-sm font-medium mb-1">
                    Deadline (optional)
                  </label>
                  <Input
                    id="need-deadline"
                    type="date"
                    value={needDeadline}
                    onChange={(e) => setNeedDeadline(e.target.value)}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={postNeed} className="w-full">
                  Post Request
                </Button>
              </CardFooter>
            </Card>
            
            {/* Your posted needs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Posted Requests</h3>
              
              {needsList.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {needsList.map((need) => (
                    <Card key={need.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge>{need.category}</Badge>
                          {need.deadline && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>Due: {new Date(need.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-base mt-2">{need.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <p className="text-sm text-muted-foreground">{need.description}</p>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm">
                            {need.fulfilled_quantity} of {need.quantity_needed} fulfilled
                          </span>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{
                                width: `${(need.fulfilled_quantity / need.quantity_needed) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    You haven't posted any requests yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl">{analyticsData.totalReceived}</CardTitle>
                <CardDescription>Total Donations Received</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl">{analyticsData.thisMonth}</CardTitle>
                <CardDescription>Donations This Month</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  <span>Impact Tracking</span>
                </CardTitle>
                <CardDescription>Impact data coming soon</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Donors</CardTitle>
                <CardDescription>Donors who have contributed the most</CardDescription>
              </CardHeader>
              
              <CardContent>
                {analyticsData.topDonors.length > 0 ? (
                  <ul className="space-y-3">
                    {analyticsData.topDonors.map((donor, index) => (
                      <li key={donor.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="font-medium">{index + 1}</span>
                          </div>
                          <span>{donor.name}</span>
                        </div>
                        <Badge variant="outline">{donor.count} donations</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No donation data available yet
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Download Reports</CardTitle>
                <CardDescription>
                  Export donation and impact data for your records
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Monthly Activity Report
                </Button>
                <Button className="w-full" variant="outline">
                  Impact Summary
                </Button>
                <Button className="w-full" variant="outline">
                  Donor Recognition Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NGODashboard;
