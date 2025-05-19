
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NGORegistrationForm from "@/components/auth/NGORegistrationForm";
import DonorRegistrationForm from "@/components/auth/DonorRegistrationForm";
import VolunteerRegistrationForm from "@/components/auth/VolunteerRegistrationForm";

const Register = () => {
  const [tabValue, setTabValue] = useState("ngo");
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-2xl font-bold text-center mb-6">Register with EcoShare</h1>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-3 w-full mb-8">
          <TabsTrigger value="ngo">As an NGO</TabsTrigger>
          <TabsTrigger value="donor">As a Donor</TabsTrigger>
          <TabsTrigger value="volunteer">As a Volunteer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ngo">
          <NGORegistrationForm />
        </TabsContent>
        
        <TabsContent value="donor">
          <DonorRegistrationForm />
        </TabsContent>
        
        <TabsContent value="volunteer">
          <VolunteerRegistrationForm />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
