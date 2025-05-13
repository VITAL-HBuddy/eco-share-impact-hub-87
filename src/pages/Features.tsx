
import React from 'react';
import Features from '@/components/Features';
import ImpactTracker from '@/components/ImpactTracker';

const FeaturesPage = () => {
  return (
    <div className="pt-8 md:pt-16 bg-eco-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Features</h1>
          <p className="text-gray-600 text-lg">
            Discover the innovative tools and systems that make EcoShare effective, transparent, and impactful.
          </p>
        </div>
      </div>
      
      <Features />
      <ImpactTracker />
    </div>
  );
};

export default FeaturesPage;
