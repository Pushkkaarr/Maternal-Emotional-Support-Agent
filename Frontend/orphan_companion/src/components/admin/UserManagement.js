import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Users, Search, Plus, Pencil, Lock, Settings, Shield, UserPlus, UserMinus, UserCheck } from "lucide-react";

// Sample data for users
const users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Coordinator", status: "Active", lastLogin: "1 day ago" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Volunteer", status: "Active", lastLogin: "3 days ago" },
  { id: 4, name: "Diana Miller", email: "diana@example.com", role: "Sponsor", status: "Active", lastLogin: "5 days ago" },
  { id: 5, name: "Edward Wilson", email: "edward@example.com", role: "Staff", status: "Inactive", lastLogin: "2 weeks ago" },
  { id: 6, name: "Fiona Taylor", email: "fiona@example.com", role: "Volunteer", status: "Active", lastLogin: "1 day ago" },
  { id: 7, name: "George Davis", email: "george@example.com", role: "Sponsor", status: "Active", lastLogin: "4 days ago" },
  { id: 8, name: "Hannah Martinez", email: "hannah@example.com", role: "Coordinator", status: "Inactive", lastLogin: "1 month ago" },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  
  // Filter function
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Status badge component
  const StatusBadge = (string) => {
    let color = status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  };

  // Role badge component
  const RoleBadge = (string) => {
    let color = "";
    
    switch (role) {
      case "Admin":
        color = "bg-purple-100 text-purple-800";
        break;
      case "Coordinator":
        color = "bg-blue-100 text-blue-800";
        break;
      case "Staff":
        color = "bg-indigo-100 text-indigo-800";
        break;
      case "Volunteer":
        color = "bg-green-100 text-green-800";
        break;
      case "Sponsor":
        color = "bg-orange-100 text-orange-800";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New User</SheetTitle>
                <SheetDescription>
                  Create a new user account and assign permissions.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input id="name" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="Email address" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input id="password" type="password" placeholder="Create a password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <Input id="role" placeholder="Select role" />
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">Create User</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">35</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-10 w-10 text-purple-500 bg-purple-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-10 w-10 text-green-500 bg-green-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">28</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-10 w-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">New (30 days)</p>
                <p className="text-2xl font-bold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>#{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><RoleBadge role={user.role} /></TableCell>
                  <TableCell><StatusBadge status={user.status} /></TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
