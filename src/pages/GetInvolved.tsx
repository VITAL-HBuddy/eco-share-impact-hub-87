
import React from 'react';
import GetInvolved from '@/components/GetInvolved';

const GetInvolvedPage = () => {
  return (
    <div className="pt-8 md:pt-16 bg-eco-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Get Involved</h1>
          <p className="text-gray-600 text-lg">
            Join our community of givers and receivers making a sustainable impact across India.
          </p>
        </div>
      </div>
      
      <GetInvolved />
    </div>
  );
};

export default GetInvolvedPage;
