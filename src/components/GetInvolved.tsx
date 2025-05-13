
import React from 'react';
import { User, HandHeart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GetInvolved = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Involved</h2>
        <p className="text-gray-600 text-lg">
          Join our growing community of donors, NGOs, and corporate partners making a sustainable impact across India.
        </p>
      </div>

      <Tabs defaultValue="individuals" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="individuals" className="text-sm md:text-base">
            <User className="h-4 w-4 mr-2 hidden md:inline" /> Individuals
          </TabsTrigger>
          <TabsTrigger value="ngos" className="text-sm md:text-base">
            <HandHeart className="h-4 w-4 mr-2 hidden md:inline" /> NGOs & Care Homes
          </TabsTrigger>
          <TabsTrigger value="corporate" className="text-sm md:text-base">
            <Home className="h-4 w-4 mr-2 hidden md:inline" /> Corporate Partners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individuals" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Individual Donors</CardTitle>
              <CardDescription>
                Have excess food, clothing, or other items? Join EcoShare to ensure they reach those in need.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-eco-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">How You Can Help:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Share excess food from parties or gatherings</li>
                  <li>Donate gently used clothes and accessories</li>
                  <li>Contribute household items you no longer need</li>
                  <li>Volunteer for collection and distribution</li>
                </ul>
              </div>
              
              <div className="bg-eco-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Benefits:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Earn EcoPoints redeemable with our partners</li>
                  <li>Track your environmental impact</li>
                  <li>Receive donation certificates for tax benefits</li>
                  <li>Connect with like-minded sustainability enthusiasts</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">Sign Up as Individual Donor</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ngos" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">NGOs & Care Homes</CardTitle>
              <CardDescription>
                Access quality donations to support your beneficiaries and reduce operational costs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-eco-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">How You Benefit:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Regular supply of fresh food and necessary items</li>
                  <li>Reduced procurement expenses</li>
                  <li>Verified donor community</li>
                  <li>Streamlined collection process</li>
                </ul>
              </div>
              
              <div className="bg-eco-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Valid NGO registration documents</li>
                  <li>Proof of operations and beneficiary details</li>
                  <li>Collection capacity information</li>
                  <li>Commitment to reporting donation utilization</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">Register as NGO Partner</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Corporate Partners</CardTitle>
              <CardDescription>
                Enhance your CSR initiatives through strategic partnership with EcoShare.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-eco-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Partnership Opportunities:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Regular donation programs for surplus inventory</li>
                  <li>Employee engagement through volunteer opportunities</li>
                  <li>Co-branded sustainability campaigns</li>
                  <li>EcoPoints redemption partnership</li>
                </ul>
              </div>
              
              <div className="bg-eco-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Benefits:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Comprehensive CSR impact reports</li>
                  <li>Enhanced brand reputation</li>
                  <li>Reduced waste management costs</li>
                  <li>Featured partnership recognition</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">Become a Corporate Partner</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GetInvolved;
