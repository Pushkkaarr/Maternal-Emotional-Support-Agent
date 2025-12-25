import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DonateForm = () => {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    donation_type: '',
    amount: '',
    items_description: '',
    services_description: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('donations')
        .insert([{
          ...formData,
          status: 'Pending'
        }]);

      if (error) throw error;

      toast.success('Thank you for your donation! We will review it shortly.');
      setFormData({
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        donation_type: '',
        amount: '',
        items_description: '',
        services_description: '',
        notes: ''
      });
    } catch (error) {
      toast.error('There was an error submitting your donation. Please try again.');
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Make a Donation</CardTitle>
        <CardDescription>
          Your generosity helps us provide better care and support to children in need.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="donor_name">Your Name</Label>
            <Input
              id="donor_name"
              value={formData.donor_name}
              onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donor_email">Email Address</Label>
            <Input
              id="donor_email"
              type="email"
              value={formData.donor_email}
              onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donor_phone">Phone Number (Optional)</Label>
            <Input
              id="donor_phone"
              value={formData.donor_phone}
              onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donation_type">Type of Donation</Label>
            <Select
              value={formData.donation_type}
              onValueChange={(value) => setFormData({ ...formData, donation_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select donation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Money">Money</SelectItem>
                <SelectItem value="Items">Items</SelectItem>
                <SelectItem value="Services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.donation_type === 'Money' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          )}

          {formData.donation_type === 'Items' && (
            <div className="space-y-2">
              <Label htmlFor="items_description">Items Description</Label>
              <Textarea
                id="items_description"
                value={formData.items_description}
                onChange={(e) => setFormData({ ...formData, items_description: e.target.value })}
                placeholder="Please describe the items you would like to donate..."
                required
              />
            </div>
          )}

          {formData.donation_type === 'Services' && (
            <div className="space-y-2">
              <Label htmlFor="services_description">Services Description</Label>
              <Textarea
                id="services_description"
                value={formData.services_description}
                onChange={(e) => setFormData({ ...formData, services_description: e.target.value })}
                placeholder="Please describe the services you would like to offer..."
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information you would like to share..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Donation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonateForm; 