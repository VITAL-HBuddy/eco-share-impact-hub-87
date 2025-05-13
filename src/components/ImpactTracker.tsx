
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";

const ImpactTracker = () => {
  // Sample data for the charts
  const monthlyData = [
    { name: 'Jan', donations: 4, emissions: 12 },
    { name: 'Feb', donations: 6, emissions: 18 },
    { name: 'Mar', donations: 8, emissions: 24 },
    { name: 'Apr', donations: 10, emissions: 30 },
    { name: 'May', donations: 7, emissions: 21 },
    { name: 'Jun', donations: 9, emissions: 27 },
  ];
  
  const donationTypeData = [
    { name: 'Food', value: 45 },
    { name: 'Clothing', value: 30 },
    { name: 'Household', value: 15 },
    { name: 'Others', value: 10 },
  ];
  
  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac'];

  return (
    <div className="bg-eco-light">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Impact Tracker</h2>
          <p className="text-gray-600 text-lg">
            Monitor your contribution to a sustainable future with our comprehensive impact dashboard.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 md:p-8 max-w-5xl mx-auto border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium">Your Impact Dashboard</h3>
            <div className="bg-eco-light px-3 py-1 rounded-full text-sm text-primary font-medium">
              Sample Preview
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-gray-500">Total Donations</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-primary">47</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-gray-500">CO₂ Saved</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-primary">132 kg</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-gray-500">EcoPoints</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-primary">850</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-gray-500">NGOs Helped</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-primary">12</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Donations & Impact</CardTitle>
                <CardDescription>Track your donations and carbon savings over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area yAxisId="left" type="monotone" dataKey="donations" stroke="#16a34a" fill="#16a34a" fillOpacity={0.3} name="Donations" />
                    <Area yAxisId="right" type="monotone" dataKey="emissions" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} name="CO₂ (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Categories</CardTitle>
                <CardDescription>Breakdown of your contributions by type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donationTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {donationTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sustainability Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>CO₂ Emissions Saved</span>
                    <span className="font-medium">132/200 kg</span>
                  </div>
                  <Progress value={66} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Donations Made</span>
                    <span className="font-medium">47/60</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>EcoPoints</span>
                    <span className="font-medium">850/1000</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full mt-4">View Full Dashboard</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
