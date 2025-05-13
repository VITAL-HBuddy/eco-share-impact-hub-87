
import React from 'react';
import { Check, Leaf, Earth, Recycle, SignPost } from 'lucide-react';

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Smart Donation Listings",
      description: "Easily list surplus items with our intuitive platform. Categorize by food, clothing, or other items, set availability times, and include photos.",
      icon: SignPost,
      benefits: [
        "Geo-location tagging for local matching",
        "Real-time availability updates",
        "Category-specific donation fields",
        "Photo upload capability"
      ]
    },
    {
      id: 2,
      title: "EcoPoints Reward System",
      description: "Get rewarded for your environmental contributions with our exclusive EcoPoints system that can be redeemed for various benefits.",
      icon: Leaf,
      benefits: [
        "Points based on impact metrics",
        "Partner discounts and offers",
        "Monthly leaderboards",
        "Donation milestone badges"
      ]
    },
    {
      id: 3,
      title: "Streamlined Logistics",
      description: "Our platform connects donors directly with receivers and provides tools to coordinate pickup or delivery seamlessly.",
      icon: SignPost,
      benefits: [
        "In-app scheduling",
        "Route optimization",
        "Real-time tracking",
        "Delivery confirmation"
      ]
    },
    {
      id: 4,
      title: "Sustainability Impact Tracker",
      description: "Visualize your environmental impact with detailed metrics on carbon emissions saved, waste diverted, and communities helped.",
      icon: Earth,
      benefits: [
        "CO2 emission reduction metrics",
        "Waste diversion statistics",
        "Social impact visualization",
        "Shareable impact certificates"
      ]
    }
  ];

  return (
    <div className="bg-eco-sand">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-gray-600 text-lg">
            Discover the innovative tools that make EcoShare a comprehensive platform for sustainable donations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg duration-300"
            >
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
