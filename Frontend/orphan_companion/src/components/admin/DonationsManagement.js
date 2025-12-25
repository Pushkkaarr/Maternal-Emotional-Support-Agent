import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Eye, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DonationsManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [donationStats, setDonationStats] = useState({
    totalMoneyDonations: 0,
    pendingDonations: 0,
    approvedDonations: 0,
    totalDonations: 0
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data);
      
      // Calculate statistics
      const moneyDonations = data.filter(d => d.donation_type === 'Money');
      const totalMoney = moneyDonations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
      const pendingCount = data.filter(d => d.status === 'Pending').length;
      const approvedCount = data.filter(d => d.status === 'Approved').length;
      
      setDonationStats({
        totalMoneyDonations: totalMoney,
        pendingDonations: pendingCount,
        approvedDonations: approvedCount,
        totalDonations: data.length
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (donationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: newStatus })
        .eq('id', donationId);

      if (error) throw error;
      fetchDonations();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateNotes = async () => {
    if (!selectedDonation) return;
    
    try {
      const { error } = await supabase
        .from('donations')
        .update({ notes: adminNotes })
        .eq('id', selectedDonation.id);

      if (error) throw error;
      setIsViewDialogOpen(false);
      fetchDonations();
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'Approved':
        return 'bg-green-500';
      case 'Rejected':
        return 'bg-red-500';
      case 'Completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const viewDonationDetails = (donation) => {
    setSelectedDonation(donation);
    setAdminNotes(donation.notes || '');
    setIsViewDialogOpen(true);
  };

  const exportToCsv = () => {
    // Create CSV content
    const headers = ["Donor Name", "Email", "Phone", "Type", "Amount", "Description", "Status", "Date"];
    const csvRows = [headers];
    
    donations.forEach(donation => {
      const details = donation.donation_type === 'Money' ? donation.amount :
                     (donation.donation_type === 'Items' ? donation.items_description :
                     donation.services_description);
      
      const row = [
        donation.donor_name,
        donation.donor_email,
        donation.donor_phone || '',
        donation.donation_type,
        donation.donation_type === 'Money' ? donation.amount : '',
        details || '',
        donation.status,
        new Date(donation.created_at).toLocaleDateString()
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `donations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Donations Management</h2>
        <Button onClick={exportToCsv} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
          Export to CSV
          </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-lg font-medium">Total Donations</p>
            <p className="text-3xl font-bold">{donationStats.totalDonations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-lg font-medium">Money Donations</p>
            <p className="text-3xl font-bold">${donationStats.totalMoneyDonations.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-lg font-medium">Pending</p>
            <p className="text-3xl font-bold">{donationStats.pendingDonations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-lg font-medium">Approved</p>
            <p className="text-3xl font-bold">{donationStats.approvedDonations}</p>
          </CardContent>
        </Card>
      </div>
      
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
          {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div>
                  <div className="font-medium">{donation.donor_name}</div>
                  <div className="text-sm text-gray-500">{donation.donor_email}</div>
                        </div>
                      </TableCell>
              <TableCell>{donation.donation_type}</TableCell>
              <TableCell>
                {donation.donation_type === 'Money' && `$${donation.amount}`}
                {donation.donation_type === 'Items' && donation.items_description}
                {donation.donation_type === 'Services' && donation.services_description}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(donation.status)}>
                  {donation.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(donation.created_at), 'MMM d, yyyy')}
              </TableCell>
                      <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewDonationDetails(donation)}
                  >
                          <Eye className="h-4 w-4" />
                        </Button>
                  <Select
                    value={donation.status}
                    onValueChange={(value) => handleStatusChange(donation.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

      {/* View Donation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Donor Information</h3>
                <p className="mt-1"><strong>Name:</strong> {selectedDonation.donor_name}</p>
                <p><strong>Email:</strong> {selectedDonation.donor_email}</p>
                {selectedDonation.donor_phone && (
                  <p><strong>Phone:</strong> {selectedDonation.donor_phone}</p>
                )}
              </div>

                        <div>
                <h3 className="text-sm font-medium text-gray-500">Donation Details</h3>
                <p className="mt-1"><strong>Type:</strong> {selectedDonation.donation_type}</p>
                {selectedDonation.donation_type === 'Money' && (
                  <p><strong>Amount:</strong> ${selectedDonation.amount}</p>
                )}
                {selectedDonation.donation_type === 'Items' && (
                  <p><strong>Items:</strong> {selectedDonation.items_description}</p>
                )}
                {selectedDonation.donation_type === 'Services' && (
                  <p><strong>Services:</strong> {selectedDonation.services_description}</p>
                )}
                <p><strong>Status:</strong> {selectedDonation.status}</p>
                <p><strong>Date:</strong> {format(new Date(selectedDonation.created_at), 'MMM d, yyyy')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_notes">Admin Notes</Label>
                <Textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this donation..."
                />
                        </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Cancel
                        </Button>
                <Button onClick={handleUpdateNotes}>Save Notes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsManagement;
