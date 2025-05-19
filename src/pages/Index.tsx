
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Trust from "@/components/Trust";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Features />
      <Trust />
      
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Make a Difference Today</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join our community of donors, NGOs, and volunteers working together to reduce waste and help those in need.
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
    </div>
  );
};

export default Index;

