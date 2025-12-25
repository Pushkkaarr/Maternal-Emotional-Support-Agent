
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUpRight, DollarSign, Users, Heart, Package, Calendar } from "lucide-react";

const AdminDashboard = () => {
  // Sample data for charts
  const donationData = [
    { name: "Jan", amount: 4000 },
    { name: "Feb", amount: 3000 },
    { name: "Mar", amount: 5000 },
    { name: "Apr", amount: 6000 },
    { name: "May", amount: 8000 },
    { name: "Jun", amount: 10000 },
  ];

  const adoptionData = [
    { name: "Jan", full: 2, virtual: 5 },
    { name: "Feb", full: 1, virtual: 8 },
    { name: "Mar", full: 3, virtual: 6 },
    { name: "Apr", full: 2, virtual: 9 },
    { name: "May", full: 4, virtual: 12 },
    { name: "Jun", full: 3, virtual: 15 },
  ];

  const inventoryData = [
    { name: "Clothes", value: 40 },
    { name: "Books", value: 25 },
    { name: "Food", value: 15 },
    { name: "Toys", value: 20 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  // Stats tiles
  const statCards = [
    {
      title: "Total Donations",
      value: "$36,000",
      change: "+12%",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Active Sponsors",
      value: "42",
      change: "+5%",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Adoptions",
      value: "15",
      change: "+20%",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: "Inventory Items",
      value: "250",
      change: "+8%",
      icon: <Package className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm">
                <span className="flex items-center text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">{stat.change}</span> from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donations Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Donations Over Time</CardTitle>
            <CardDescription>Monthly monetary donation totals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={{ amount: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } } }}>
                <AreaChart data={donationData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8B5CF6" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Adoption Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Adoption Trends</CardTitle>
            <CardDescription>Full vs. Virtual Adoptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={{ 
                full: { theme: { light: "#F97316", dark: "#F97316" } },
                virtual: { theme: { light: "#0EA5E9", dark: "#0EA5E9" } }
              }}>
                <BarChart data={adoptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="full" fill="#F97316" name="Full Adoptions" />
                  <Bar dataKey="virtual" fill="#0EA5E9" name="Virtual Adoptions" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>Breakdown of donated items by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Scheduled pickups, visits, and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {item === 1 ? "Donation Pickup" : 
                       item === 2 ? "Sponsor Visit" : 
                       item === 3 ? "Child Birthday" : 
                       item === 4 ? "Adoption Meeting" : 
                       "Volunteer Training"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item === 1 ? "Tomorrow, 10:00 AM" : 
                       item === 2 ? "July 22, 2:00 PM" : 
                       item === 3 ? "July 24, All Day" : 
                       item === 4 ? "July 26, 11:00 AM" : 
                       "July 30, 9:00 AM"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
