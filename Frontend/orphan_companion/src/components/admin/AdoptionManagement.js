import React, { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, Search, Filter, Download, Heart, CheckCircle, XCircle, 
  Clock, Loader2, AlertCircle, Badge
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { toast } from "sonner";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AdoptionManagement = () => {
  const [fullAdoptions, setFullAdoptions] = useState([]);
  const [virtualAdoptions, setVirtualAdoptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [adoptionType, setAdoptionType] = useState('full');
  const [adoptionStats, setAdoptionStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0
  });
  
  useEffect(() => {
    fetchAdoptionData();
  }, []);
  
  const fetchAdoptionData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch full adoption applications
      const { data: adoptionData, error: adoptionError } = await supabase
        .from('adoption_applications')
        .select(`
          *,
          children:child_id (
            full_name, 
            age,
            gender
          )
        `)
        .order('application_date', { ascending: false });
        
      if (adoptionError) throw adoptionError;
        
      // Fetch virtual adoption sponsorships
      const { data: sponsorshipData, error: sponsorshipError } = await supabase
        .from('sponsorships')
        .select(`
          *,
          children:child_id (
            full_name, 
            age,
            gender
          )
        `)
        .order('start_date', { ascending: false });
        
      if (sponsorshipError) throw sponsorshipError;
      
      // Set the data
      setFullAdoptions(adoptionData || []);
      setVirtualAdoptions(sponsorshipData || []);
      
      // Calculate statistics
      const totalAdoptions = (adoptionData?.length || 0) + (sponsorshipData?.length || 0);
      const activeAdoptions = 
        (adoptionData?.filter(a => ['Approved', 'Completed', 'In Progress'].includes(a.status))?.length || 0) +
        (sponsorshipData?.filter(s => s.status === 'Active')?.length || 0);
      const pendingAdoptions = 
        (adoptionData?.filter(a => a.status === 'Pending Review')?.length || 0) +
        (sponsorshipData?.filter(s => s.status === 'Pending')?.length || 0);
      const rejectedAdoptions = 
        (adoptionData?.filter(a => a.status === 'Rejected')?.length || 0) +
        (sponsorshipData?.filter(s => ['Cancelled', 'Paused', 'Completed'].includes(s.status))?.length || 0);
      
      setAdoptionStats({
        total: totalAdoptions,
        active: activeAdoptions,
        pending: pendingAdoptions,
        rejected: rejectedAdoptions
      });
    } catch (error) {
      console.error("Error fetching adoption data:", error);
      toast.error("Failed to load adoption data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewDetails = (adoption, type) => {
    setSelectedAdoption(adoption);
    setAdoptionType(type);
    setIsViewDialogOpen(true);
  };
  
  const handleUpdateStatus = async (id, newStatus, type) => {
    try {
      const table = type === 'full' ? 'adoption_applications' : 'sponsorships';
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Status updated to ${newStatus}`);
      fetchAdoptionData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };
  
  // Filter functions
  const filteredFullAdoptions = fullAdoptions.filter(adoption => {
    const matchesSearch = 
      adoption.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      adoption.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.children?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || adoption.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const filteredVirtualAdoptions = virtualAdoptions.filter(adoption => {
    const matchesSearch = 
      adoption.sponsor_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      adoption.sponsor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.children?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || adoption.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    let color = "bg-gray-100 text-gray-800";
    
    if (status === "Active" || status === "Approved" || status === "Completed") {
      color = "bg-green-100 text-green-800";
    } else if (status === "Pending" || status === "Pending Review" || status === "In Progress") {
      color = "bg-blue-100 text-blue-800";
    } else if (status === "Rejected" || status === "Cancelled" || status === "Paused") {
      color = "bg-red-100 text-red-800";
    }
    
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading adoption data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Adoption Management</h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search adoptions..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
                <span>{statusFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => {
            // In a real app, this would export to CSV
            toast.info("Exporting data...");
          }}>
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Adoptions</p>
                <p className="text-2xl font-bold">{adoptionStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-10 w-10 text-green-500 bg-green-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved/Active</p>
                <p className="text-2xl font-bold">{adoptionStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-10 w-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{adoptionStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-10 w-10 text-red-500 bg-red-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected/Inactive</p>
                <p className="text-2xl font-bold">{adoptionStats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Adoption Tables */}
      <Tabs defaultValue="full" className="w-full">
        <TabsList>
          <TabsTrigger value="full">Full Adoptions</TabsTrigger>
          <TabsTrigger value="virtual">Virtual Adoptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="full">
          <Card>
            <CardHeader>
              <CardTitle>Full Adoption Applications</CardTitle>
              <CardDescription>View and manage full adoption requests</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFullAdoptions.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No adoption applications found matching your filters.</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Child</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFullAdoptions.map((adoption) => (
                    <TableRow key={adoption.id}>
                        <TableCell className="font-mono text-xs">{adoption.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-medium">{adoption.applicant_name}</TableCell>
                      <TableCell>
                        <div>
                            <p className="font-medium">{adoption.children?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">
                              {adoption.children ? `${adoption.children.age} years, ${adoption.children.gender}` : 'Child data unavailable'}
                            </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                            <p className="text-sm">{adoption.applicant_email}</p>
                            <p className="text-xs text-muted-foreground">{adoption.applicant_phone}</p>
                        </div>
                      </TableCell>
                        <TableCell>{format(new Date(adoption.application_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell><StatusBadge status={adoption.status} /></TableCell>
                      <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(adoption, 'full')}
                            >
                          <Eye className="h-4 w-4" />
                        </Button>
                            <Select 
                              value={adoption.status} 
                              onValueChange={(value) => handleUpdateStatus(adoption.id, value, 'full')}
                            >
                              <SelectTrigger className="w-[130px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending Review">Pending Review</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="virtual">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Adoption Sponsorships</CardTitle>
              <CardDescription>View and manage virtual adoption sponsorships</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredVirtualAdoptions.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No sponsorships found matching your filters.</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Child</TableHead>
                    <TableHead>Sponsorship</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVirtualAdoptions.map((adoption) => (
                    <TableRow key={adoption.id}>
                        <TableCell className="font-mono text-xs">{adoption.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                            <p className="font-medium">{adoption.sponsor_name}</p>
                            <p className="text-xs text-muted-foreground">{adoption.sponsor_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                            <p className="font-medium">{adoption.children?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">
                              {adoption.children ? `${adoption.children.age} years, ${adoption.children.gender}` : 'Child data unavailable'}
                            </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                            <p className="font-medium">${adoption.monthly_amount}/month</p>
                            <p className="text-xs text-muted-foreground">
                              {adoption.is_ongoing 
                                ? 'Ongoing' 
                                : adoption.duration_months 
                                  ? `${adoption.duration_months} months` 
                                  : 'Not specified'}
                            </p>
                        </div>
                      </TableCell>
                        <TableCell>{format(new Date(adoption.start_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell><StatusBadge status={adoption.status} /></TableCell>
                      <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(adoption, 'virtual')}
                            >
                          <Eye className="h-4 w-4" />
                        </Button>
                            <Select 
                              value={adoption.status} 
                              onValueChange={(value) => handleUpdateStatus(adoption.id, value, 'virtual')}
                            >
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Paused">Paused</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {adoptionType === 'full' ? 'Adoption Application Details' : 'Sponsorship Details'}
            </DialogTitle>
            <DialogDescription>
              {adoptionType === 'full' 
                ? 'View the full details of this adoption application.' 
                : 'View the full details of this sponsorship.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAdoption && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {adoptionType === 'full' ? 'Applicant Information' : 'Sponsor Information'}
                </h3>
                <div className="bg-muted/20 p-3 rounded-md space-y-1">
                  <p><span className="font-medium">Name:</span> {adoptionType === 'full' ? selectedAdoption.applicant_name : selectedAdoption.sponsor_name}</p>
                  <p><span className="font-medium">Email:</span> {adoptionType === 'full' ? selectedAdoption.applicant_email : selectedAdoption.sponsor_email}</p>
                  <p><span className="font-medium">Phone:</span> {adoptionType === 'full' ? selectedAdoption.applicant_phone : selectedAdoption.sponsor_phone}</p>
                  {adoptionType === 'full' && (
                    <p><span className="font-medium">Address:</span> {selectedAdoption.address}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Child Information</h3>
                <div className="bg-muted/20 p-3 rounded-md space-y-1">
                  <p><span className="font-medium">Name:</span> {selectedAdoption.children?.full_name || 'Unknown'}</p>
                  {selectedAdoption.children && (
                    <>
                      <p><span className="font-medium">Age:</span> {selectedAdoption.children.age} years</p>
                      <p><span className="font-medium">Gender:</span> {selectedAdoption.children.gender}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {adoptionType === 'full' ? 'Application Details' : 'Sponsorship Details'}
                </h3>
                <div className="bg-muted/20 p-3 rounded-md space-y-1">
                  <p>
                    <span className="font-medium">Status:</span> 
                    <StatusBadge status={selectedAdoption.status} />
                  </p>
                  <p>
                    <span className="font-medium">{adoptionType === 'full' ? 'Application Date:' : 'Start Date:'}</span> 
                    {format(new Date(adoptionType === 'full' ? selectedAdoption.application_date : selectedAdoption.start_date), 'PPP')}
                  </p>
                  
                  {adoptionType === 'full' ? (
                    <>
                      {selectedAdoption.financial_info && (
                        <p><span className="font-medium">Financial Information:</span> {selectedAdoption.financial_info}</p>
                      )}
                      {selectedAdoption.reason && (
                        <p><span className="font-medium">Reason for Adoption:</span> {selectedAdoption.reason}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p><span className="font-medium">Monthly Amount:</span> ${selectedAdoption.monthly_amount}</p>
                      <p>
                        <span className="font-medium">Duration:</span> 
                        {selectedAdoption.is_ongoing 
                          ? 'Ongoing' 
                          : selectedAdoption.duration_months 
                            ? `${selectedAdoption.duration_months} months` 
                            : 'Not specified'}
                      </p>
                      {selectedAdoption.message && (
                        <p><span className="font-medium">Message:</span> {selectedAdoption.message}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                
                <Select 
                  value={selectedAdoption.status} 
                  onValueChange={(value) => {
                    handleUpdateStatus(selectedAdoption.id, value, adoptionType);
                    setIsViewDialogOpen(false);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adoptionType === 'full' ? (
                      <>
                        <SelectItem value="Pending Review">Pending Review</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdoptionManagement;
