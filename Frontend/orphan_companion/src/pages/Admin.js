import React, { useState } from "react";
import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ChildManagement from "@/components/admin/ChildManagement";
import DonationsManagement from "@/components/admin/DonationsManagement";
import InventoryManagement from "@/components/admin/InventoryManagement";
import ReportsAnalytics from "@/components/admin/ReportsAnalytics";
import Communication from "@/components/admin/Communication";
import AdoptionManagement from "@/components/admin/AdoptionManagement";
import UserManagement from "@/components/admin/UserManagement";
import { createBrowserClient } from '@supabase/ssr';
import { Button } from "@/components/ui/button";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleLogin = async (username, password) => {
    try {
      // Only use hardcoded admin credentials
      if (username === "admin" && password === "admin123") {
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed');
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 gap-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="adoption">Adoption</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="children">
            <ChildManagement />
          </TabsContent>
          
          <TabsContent value="adoption">
            <AdoptionManagement />
          </TabsContent>
          
          <TabsContent value="donations">
            <DonationsManagement />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>
          
          <TabsContent value="communication">
            <Communication />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Admin;
