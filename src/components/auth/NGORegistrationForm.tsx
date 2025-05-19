
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const ngoFormSchema = z.object({
  // Organization Details
  ngoName: z.string().min(3, { message: "NGO name must be at least 3 characters" }),
  registeredAddress: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  yearEstablished: z.string().regex(/^\d{4}$/, { message: "Enter a valid year (e.g. 2020)" }),
  ngoType: z.enum(["Trust", "Society", "Section 8", "Other"]),
  registrationNumber: z.string().min(3, { message: "Registration number is required" }),
  issuingAuthority: z.string().min(3, { message: "Issuing authority is required" }),
  
  // Point of Contact
  contactName: z.string().min(3, { message: "Contact name is required" }),
  designation: z.string().min(2, { message: "Designation is required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm password is required" }),
  
  // Causes
  causes: z.array(z.string()).min(1, { message: "Select at least one cause" }),
  otherCause: z.string().optional(),
  
  // Terms
  agreeTerms: z.boolean().refine(val => val === true, { message: "You must agree to terms and conditions" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type NGOFormValues = z.infer<typeof ngoFormSchema>;

const NGORegistrationForm = () => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const form = useForm<NGOFormValues>({
    resolver: zodResolver(ngoFormSchema),
    defaultValues: {
      ngoName: "",
      registeredAddress: "",
      city: "",
      state: "",
      yearEstablished: "",
      ngoType: "Trust",
      registrationNumber: "",
      issuingAuthority: "",
      contactName: "",
      designation: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      causes: [],
      otherCause: "",
      agreeTerms: false
    }
  });
  
  const onSubmit = async (values: NGOFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Register user with Supabase Auth
      const { error: signUpError, data } = await signUp(
        values.email,
        values.password,
        "ngo", // role
        { name: values.contactName }
      );
      
      if (signUpError || !data.user) {
        throw new Error(signUpError?.message || "Failed to create account");
      }
      
      const userId = data.user.id;
      
      // Create NGO profile
      const { error: profileError } = await supabase.from("ngo_profiles").insert({
        id: userId,
        ngo_name: values.ngoName,
        registered_address: values.registeredAddress,
        city: values.city,
        state: values.state,
        year_established: parseInt(values.yearEstablished),
        ngo_type: values.ngoType,
        registration_number: values.registrationNumber,
        issuing_authority: values.issuingAuthority
      });
      
      if (profileError) {
        throw new Error(profileError.message);
      }
      
      // Create NGO contact
      const { error: contactError } = await supabase.from("ngo_contacts").insert({
        ngo_id: userId,
        representative_name: values.contactName,
        designation: values.designation,
        phone_number: values.phoneNumber,
        email: values.email
      });
      
      if (contactError) {
        throw new Error(contactError.message);
      }
      
      // Add causes
      for (const causeName of values.causes) {
        // Get cause ID from name
        const { data: causeData, error: causeError } = await supabase
          .from("causes")
          .select("id")
          .eq("name", causeName)
          .single();
        
        if (causeError || !causeData) {
          console.error("Error finding cause:", causeName, causeError);
          continue;
        }
        
        // Create ngo_cause relationship
        const otherDescription = causeName === "Other" ? values.otherCause : null;
        await supabase.from("ngo_causes").insert({
          ngo_id: userId,
          cause_id: causeData.id,
          other_description: otherDescription
        });
      }
      
      toast({
        title: "Registration successful!",
        description: "Your NGO account has been created. Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    if (step === 1) {
      // Validate first step fields
      const result = form.trigger([
        "ngoName", 
        "registeredAddress", 
        "city", 
        "state", 
        "yearEstablished", 
        "ngoType", 
        "registrationNumber", 
        "issuingAuthority"
      ]);
      
      if (result) {
        setStep(2);
      }
    } else if (step === 2) {
      // Validate second step fields
      const result = form.trigger([
        "contactName",
        "designation",
        "phoneNumber",
        "email",
        "password",
        "confirmPassword"
      ]);
      
      if (result) {
        setStep(3);
      }
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const causeOptions = [
    "Orphan care",
    "Women welfare",
    "Elderly support",
    "Hunger relief",
    "Education",
    "Other"
  ];
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Register as an NGO</CardTitle>
        <CardDescription>
          {step === 1 && "Step 1: Organization Details"}
          {step === 2 && "Step 2: Contact Information"}
          {step === 3 && "Step 3: Mission & Focus"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="ngoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NGO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter NGO name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="registeredAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter registered address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="yearEstablished"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Establishment</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ngoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NGO Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select NGO type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Trust">Trust</SelectItem>
                          <SelectItem value="Society">Society</SelectItem>
                          <SelectItem value="Section 8">Section 8</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter registration number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issuingAuthority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuing Authority</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter issuing authority" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Authorized Representative</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter designation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="causes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">What causes does your NGO serve?</FormLabel>
                        <FormDescription>
                          Select all that apply
                        </FormDescription>
                      </div>
                      {causeOptions.map((cause) => (
                        <FormField
                          key={cause}
                          control={form.control}
                          name="causes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={cause}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(cause)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, cause])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== cause
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {cause}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("causes")?.includes("Other") && (
                  <FormField
                    control={form.control}
                    name="otherCause"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify other cause</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter other cause" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the terms and conditions
                        </FormLabel>
                        <FormDescription>
                          You agree to our terms of service and privacy policy.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NGORegistrationForm;
