
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to EcoShare</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Connecting donors with NGOs to reduce waste and make a positive impact on our community and environment.
        </p>
        
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        ) : (
          <Button size="lg" asChild>
            <Link to={`/dashboard/${user.role || ""}`}>Go to Dashboard</Link>
          </Button>
        )}
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>For Donors</CardTitle>
              <CardDescription>Individuals and businesses with items to donate</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Register as a donor</li>
                <li>List items you want to donate</li>
                <li>Get matched with NGOs who need your items</li>
                <li>Track the impact of your donations</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register?type=donor">Register as Donor</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>For NGOs</CardTitle>
              <CardDescription>Organizations that serve communities in need</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Register and verify your organization</li>
                <li>Browse available donations</li>
                <li>Post specific items your organization needs</li>
                <li>Share impact stories with donors</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/register?type=ngo">Register as NGO</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>For Volunteers</CardTitle>
              <CardDescription>Individuals who want to help with deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Register as a volunteer</li>
                <li>Choose when you're available</li>
                <li>Help transport donations to NGOs</li>
                <li>Make a difference in your community</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register?type=volunteer">Register as Volunteer</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Make a Difference Today</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join our community of donors, NGOs, and volunteers working together to reduce waste and help those in need.
        </p>
        <Button size="lg" asChild>
          <Link to="/register">Join EcoShare</Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
