
import React from 'react';
import HowItWorks from '@/components/HowItWorks';
import Trust from '@/components/Trust';

const HowItWorksPage = () => {
  return (
    <div className="pt-8 md:pt-16 bg-eco-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">How EcoShare Works</h1>
          <p className="text-gray-600 text-lg">
            Learn about our simple yet powerful process that connects surplus generators with those in need.
          </p>
        </div>
      </div>
      
      <HowItWorks />
      <Trust />
    </div>
  );
};

export default HowItWorksPage;
