import React from 'react';
import { CheckCircle, Leaf, User, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "List Your Surplus",
      description: "Restaurants, retailers, or individuals can easily list surplus food, clothes, or other items through our platform.",
      icon: User
    },
    {
      id: 2,
      title: "NGOs Respond & Collect",
      description: "Verified NGOs near your location will get notified and arrange for collection according to your schedule.",
      icon: HandHeart
    },
    {
      id: 3,
      title: "Earn EcoPoints",
      description: "Get rewarded with EcoPoints for your contributions which can be redeemed for various benefits.",
      icon: Leaf
    },
    {
      id: 4,
      title: "Track Your Impact",
      description: "Monitor how your donations help reduce carbon emissions and create positive change in communities.",
      icon: CheckCircle
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How EcoShare Works</h2>
        <p className="text-gray-600 text-lg">
          Our simple 4-step process makes donating surplus items efficient while maximizing environmental and social impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connection lines */}
        <div className="hidden lg:block absolute top-1/3 left-[25%] w-[50%] border-t-2 border-dashed border-primary/40 z-0"></div>
        
        {steps.map((step) => (
          <div 
            key={step.id}
            className="relative bg-white rounded-xl shadow-md p-6 z-10 transform transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
          >
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <step.icon className="h-8 w-8 text-primary" />
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                {step.id}
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button
          className="cta-button bg-primary hover:bg-primary/90 text-white"
          onClick={() => window.location.href = '/register'}
        >
          Start Donating Today
        </Button>
      </div>
    </div>
  );
};

export default HowItWorks;
