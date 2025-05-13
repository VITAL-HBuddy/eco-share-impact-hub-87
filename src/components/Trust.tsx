
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Shield, Info } from "lucide-react";

const Trust = () => {
  const verificationSteps = [
    {
      title: "NGO Verification",
      description: "We thoroughly verify all NGOs and care homes through a multi-step process including document verification, physical inspections, and background checks."
    },
    {
      title: "Quality Assurance",
      description: "All food donations follow FSSAI guidelines, and other items undergo quality checks before being accepted on our platform."
    },
    {
      title: "Transparent Tracking",
      description: "Every donation is tracked from giver to receiver with timestamp verification and delivery confirmation."
    },
    {
      title: "Impact Verification",
      description: "Our impact metrics are calculated using verified methodologies and regularly audited by sustainability experts."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trust & Verification</h2>
        <p className="text-gray-600 text-lg">
          We've built robust verification systems to ensure transparency and reliability across our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {verificationSteps.map((step, index) => (
          <Card key={index} className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-eco-light rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="flex items-start mb-6">
          <Shield className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-medium mb-2">Our Trust Promise</h3>
            <p className="text-gray-700">
              At EcoShare, we prioritize trust, transparency, and safety. We ensure that all donations reach the intended recipients and create the maximum positive impact for communities and our environment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 text-primary mr-2" />
              <h4 className="font-medium">For Donors</h4>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Verified recipient profiles with reviews</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Donation utilization reports and photos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Tax benefit documentation where applicable</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 text-primary mr-2" />
              <h4 className="font-medium">For NGOs</h4>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Donor history and reliability scores</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Quality standards assurance</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Direct communication channels</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trust;
