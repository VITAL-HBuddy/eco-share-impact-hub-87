
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Form schema
const formSchema = z.object({
  // Section A: Organization Details
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  ngoName: z.string().min(2, "NGO name is required"),
  registeredAddress: z.string().min(5, "Registered address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  yearEstablished: z.coerce.number()
    .int("Year must be a whole number")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  ngoType: z.enum(["Trust", "Society", "Section 8", "Other"]),
  registrationNumber: z.string().min(3, "Registration number is required"),
  issuingAuthority: z.string().min(3, "Issuing authority is required"),
  
  // Section B: Point of Contact
  representativeName: z.string().min(2, "Representative name is required"),
  designation: z.string().min(2, "Designation is required"),
  phone: z.string().min(10, "Phone number is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  
  // Section C: Document Uploads - will be handled separately with file inputs
  
  // Section D: Mission & Focus
  causes: z.array(z.string()).min(1, "Please select at least one cause"),
  otherCause: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const NGORegistrationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ngoName: "",
      registeredAddress: "",
      city: "",
      state: "",
      yearEstablished: new Date().getFullYear(),
      ngoType: "Trust",
      registrationNumber: "",
      issuingAuthority: "",
      representativeName: "",
      designation: "",
      phone: "",
      contactEmail: "",
      causes: [],
      otherCause: "",
    },
  });
  
  // Form documents state
  const [documents, setDocuments] = useState({
    registrationCertificate: null as File | null,
    panCard: null as File | null,
    taxCertificate: null as File | null,
    fcraCertificate: null as File | null,
    idProof: null as File | null,
  });
  
  // Cause options
  const causeOptions = [
    { id: "orphan-care", label: "Orphan care" },
    { id: "women-welfare", label: "Women welfare" },
    { id: "elderly-support", label: "Elderly support" },
    { id: "hunger-relief", label: "Hunger relief" },
    { id: "education", label: "Education" },
    { id: "other", label: "Other" },
  ];
  
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [documentType]: e.target.files[0],
      });
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    
    try {
      // 1. Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: "ngo",
          },
        },
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        const userId = authData.user.id;
        
        // 2. Insert NGO profile data
        const { error: profileError } = await supabase
          .from("ngo_profiles")
          .insert({
            id: userId,
            ngo_name: values.ngoName,
            registered_address: values.registeredAddress,
            city: values.city,
            state: values.state,
            year_established: values.yearEstablished,
            ngo_type: values.ngoType,
            registration_number: values.registrationNumber,
            issuing_authority: values.issuingAuthority,
          });
          
        if (profileError) throw profileError;
        
        // 3. Insert contact information
        const { error: contactError } = await supabase
          .from("ngo_contacts")
          .insert({
            ngo_id: userId,
            representative_name: values.representativeName,
            designation: values.designation,
            phone_number: values.phone,
            email: values.contactEmail,
          });
          
        if (contactError) throw contactError;
        
        // 4. Insert causes
        for (const cause of values.causes) {
          // Get cause ID from name
          const { data: causeData } = await supabase
            .from("causes")
            .select("id")
            .eq("name", cause)
            .single();
            
          if (causeData) {
            await supabase.from("ngo_causes").insert({
              ngo_id: userId,
              cause_id: causeData.id,
              other_description: cause === "Other" ? values.otherCause : null,
            });
          }
        }
        
        // 5. Upload documents
        if (documents.registrationCertificate) {
          const filePath = `${userId}/registration_certificate_${documents.registrationCertificate.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from("ngo_documents")
            .upload(filePath, documents.registrationCertificate);
            
          if (!uploadError) {
            await supabase.from("ngo_documents").insert({
              ngo_id: userId,
              document_type: "registration_certificate",
              file_path: filePath,
            });
          }
        }
        
        // Upload other documents similarly...
        
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account. Your profile will be reviewed by our team.",
        });
        
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was an error registering your account. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const nextStep = () => {
    let canProceed = false;
    
    if (step === 1) {
      const result = form.trigger([
        "email", 
        "password", 
        "confirmPassword", 
        "ngoName", 
        "registeredAddress", 
        "city", 
        "state", 
        "yearEstablished", 
        "ngoType", 
        "registrationNumber", 
        "issuingAuthority"
      ]);
      canProceed = result;
    } else if (step === 2) {
      const result = form.trigger([
        "representativeName", 
        "designation", 
        "phone", 
        "contactEmail"
      ]);
      canProceed = result;
    } else {
      canProceed = true;
    }
    
    if (canProceed) {
      setStep(Math.min(step + 1, 4));
    }
  };
  
  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>NGO Registration</CardTitle>
        <CardDescription>
          Register your NGO to connect with donors and make a difference
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account & Organization Details</h3>
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address*</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
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
                        <FormLabel>Password*</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          At least 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password*</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="ngoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NGO Name*</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Registered Address*</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City*</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>State*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="yearEstablished"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Establishment*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1900" max={new Date().getFullYear()} />
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
                        <FormLabel>NGO Type*</FormLabel>
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number*</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Issuing Authority*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Point of Contact</h3>
                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="representativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Authorized Representative*</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Designation*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID*</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documents Upload</h3>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  Please upload the following documents. All files should be in PDF format.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="registrationCertificate">
                      NGO Registration Certificate* (PDF)
                    </label>
                    <Input
                      id="registrationCertificate"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleDocumentChange(e, 'registrationCertificate')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="panCard">
                      PAN Card* (PDF)
                    </label>
                    <Input
                      id="panCard"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleDocumentChange(e, 'panCard')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="taxCertificate">
                      80G / 12A Certificate (if available) (PDF)
                    </label>
                    <Input
                      id="taxCertificate"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleDocumentChange(e, 'taxCertificate')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="fcraCertificate">
                      FCRA Certificate (if available) (PDF)
                    </label>
                    <Input
                      id="fcraCertificate"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleDocumentChange(e, 'fcraCertificate')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="idProof">
                      ID Proof of Signatory* (Aadhar/Passport) (PDF)
                    </label>
                    <Input
                      id="idProof"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleDocumentChange(e, 'idProof')}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mission & Focus</h3>
                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="causes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>What causes does your NGO serve?* (Select multiple)</FormLabel>
                        <FormDescription>
                          Choose all that apply
                        </FormDescription>
                      </div>
                      {causeOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="causes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.label)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.label])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.label
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Complete Registration"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <div className="flex space-x-2">
          <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`h-2 w-2 rounded-full ${step >= 4 ? 'bg-primary' : 'bg-gray-300'}`}></div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NGORegistrationForm;
