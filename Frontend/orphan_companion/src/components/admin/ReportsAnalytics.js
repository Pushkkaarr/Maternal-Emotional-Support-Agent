import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Download, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, TrendingUp } from "lucide-react";

const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState("6months");
  
  // Sample data for donations over time
  const donationData = [
    { month: "Jan", monetary: 4000, physical: 20 },
    { month: "Feb", monetary: 3500, physical: 15 },
    { month: "Mar", monetary: 5000, physical: 25 },
    { month: "Apr", monetary: 6000, physical: 30 },
    { month: "May", monetary: 8000, physical: 35 },
    { month: "Jun", monetary: 7500, physical: 40 },
  ];
  
  // Sample data for adoption statistics
  const adoptionData = [
    { month: "Jan", full: 2, virtual: 8 },
    { month: "Feb", full: 1, virtual: 10 },
    { month: "Mar", full: 3, virtual: 12 },
    { month: "Apr", full: 2, virtual: 15 },
    { month: "May", full: 4, virtual: 18 },
    { month: "Jun", full: 3, virtual: 20 },
  ];
  
  // Sample data for age distribution
  const ageDistribution = [
    { name: "0-3 years", value: 10 },
    { name: "4-7 years", value: 15 },
    { name: "8-12 years", value: 12 },
    { name: "13-18 years", value: 5 },
  ];
  
  // Sample data for user growth
  const userGrowth = [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 120 },
    { month: "Mar", users: 150 },
    { month: "Apr", users: 180 },
    { month: "May", users: 220 },
    { month: "Jun", users: 270 },
  ];
  
  // Colors for charts
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        
        <div className="flex items-center space-x-2">
          <Select>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </Select>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">$36,000</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+12%</span> from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Adoptions Completed</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full text-orange-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+20%</span> from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Virtual Sponsors</p>
                <p className="text-2xl font-bold">83</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full text-blue-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+15%</span> from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Items</p>
                <p className="text-2xl font-bold">495</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full text-green-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+8%</span> from previous period
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Report Tabs and Charts */}
      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Donations
          </TabsTrigger>
          <TabsTrigger value="adoptions" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" /> Adoptions
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" /> Demographics
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Engagement
          </TabsTrigger>
        </TabsList>
        
        {/* Donations Tab */}
        <TabsContent value="donations">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monetary Donations</CardTitle>
                <CardDescription>Total donations by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{ 
                    monetary: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } }
                  }}>
                    <LineChart data={donationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="monetary" 
                        stroke="#8B5CF6" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Physical Donations</CardTitle>
                <CardDescription>Number of physical donations by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{ 
                    physical: { theme: { light: "#F97316", dark: "#F97316" } }
                  }}>
                    <BarChart data={donationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="physical" fill="#F97316" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Adoptions Tab */}
        <TabsContent value="adoptions">
          <Card>
            <CardHeader>
              <CardTitle>Adoption Trends</CardTitle>
              <CardDescription>Full vs. Virtual adoptions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={{ 
                  full: { theme: { light: "#F97316", dark: "#F97316" } },
                  virtual: { theme: { light: "#0EA5E9", dark: "#0EA5E9" } }
                }}>
                  <BarChart data={adoptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="full" fill="#F97316" name="Full Adoptions" />
                    <Bar dataKey="virtual" fill="#0EA5E9" name="Virtual Adoptions" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Demographics Tab */}
        <TabsContent value="demographics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Children's age distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {ageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Adoption Success Rate</CardTitle>
                <CardDescription>Percentage of successful adoptions by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{ 
                    success: { theme: { light: "#10b981", dark: "#10b981" } }
                  }}>
                    <BarChart data={[
                      { age: "0-3 years", success: 75 },
                      { age: "4-7 years", success: 60 },
                      { age: "8-12 years", success: 45 },
                      { age: "13-18 years", success: 30 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="success" fill="#10b981" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{ 
                    users: { theme: { light: "#0ea5e9", dark: "#0ea5e9" } }
                  }}>
                    <LineChart data={userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#0ea5e9" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Page Visits</CardTitle>
                <CardDescription>Most visited pages on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{ 
                    visits: { theme: { light: "#8b5cf6", dark: "#8b5cf6" } }
                  }}>
                    <BarChart layout="vertical" data={[
                      { page: "Home", visits: 5000 },
                      { page: "About", visits: 3500 },
                      { page: "Donate", visits: 4200 },
                      { page: "Adopt", visits: 3800 },
                      { page: "Chat", visits: 2500 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="page" type="category" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="visits" fill="#8b5cf6" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;
