
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Recycle, Earth, HandHeart, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-eco-light">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Reducing Waste Through 
              <span className="text-primary block mt-2">Sustainable Donations</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-lg">
              EcoShare connects surplus generators with NGOs and care homes across India, 
              turning potential waste into valuable resources while tracking your environmental impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="cta-button bg-primary hover:bg-primary/90 text-white">
                Donate Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="cta-button border-primary text-primary hover:bg-primary/10">
                Join as NGO
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105 duration-300">
              <div className="bg-eco-light rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Earth className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Reduce Carbon Footprint</h3>
              <p className="text-gray-600">Track your environmental impact with every donation you make.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105 duration-300 sm:mt-8">
              <div className="bg-eco-light rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <HandHeart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Help Communities</h3>
              <p className="text-gray-600">Your surplus directly helps those in need across India.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105 duration-300">
              <div className="bg-eco-light rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Recycle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Earn EcoPoints</h3>
              <p className="text-gray-600">Get rewarded for your sustainable actions and donations.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105 duration-300 sm:mt-8">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Verified Impact</h3>
              <p className="text-gray-600">All donations and impact are verified and transparent.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Trusted by Organizations Across India</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            {/* Placeholder for partner logos */}
            <div className="bg-gray-200 h-12 w-32 rounded-md flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 1</span>
            </div>
            <div className="bg-gray-200 h-12 w-32 rounded-md flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 2</span>
            </div>
            <div className="bg-gray-200 h-12 w-32 rounded-md flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 3</span>
            </div>
            <div className="bg-gray-200 h-12 w-32 rounded-md flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
