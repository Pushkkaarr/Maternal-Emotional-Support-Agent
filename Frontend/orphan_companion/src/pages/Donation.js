import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, DollarSign, GiftIcon, HandCoins, Heart, Package, PiggyBank, UserPlus } from 'lucide-react';
import { toast } from "sonner";
import { createBrowserClient } from '@supabase/ssr';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DonationPage = () => {
  // Form state
  const [donationType, setDonationType] = useState("monetary");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationFrequency, setDonationFrequency] = useState("one-time");
  const [itemCategory, setItemCategory] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("dropoff");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  
  // Wishlist items
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);
  const [donationStats, setDonationStats] = useState({
    monetaryTotal: 0,
    childrenSupported: 0,
    physicalItems: 0
  });
  
  useEffect(() => {
    fetchWishlistItems();
    fetchDonationStats();
  }, []);
  
  const fetchWishlistItems = async () => {
    try {
      setIsLoadingWishlist(true);
      const { data, error } = await supabase
        .from('inventory_requests')
        .select('*')
        .eq('display_on_wishlist', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setWishlistItems(data || []);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      toast.error("Unable to load wishlist items");
    } finally {
      setIsLoadingWishlist(false);
    }
  };
  
  const fetchDonationStats = async () => {
    try {
      // These would be real queries in a production app
      // For now we'll use placeholder values
      setDonationStats({
        monetaryTotal: 25480,
        childrenSupported: 184,
        physicalItems: 350
      });
    } catch (error) {
      console.error("Error fetching donation stats:", error);
    }
  };
  
  // Handle monetary donation
  const handleMonetaryDonation = async (e) => {
    e.preventDefault();
    
    try {
      // Save donation to the donations table
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          donation_type: 'Money',
          amount: donationAmount,
          notes: itemDescription,
          status: 'Pending'
        }]);

      if (error) throw error;
      
    // In a real app, we would connect to a payment gateway here
    toast.success("Thank you for your donation! Redirecting to payment...");
    
    // Reset form
    setDonationAmount("");
    setItemDescription("");
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast.error("There was a problem submitting your donation. Please try again.");
    }
  };
  
  // Handle physical donation
  const handlePhysicalDonation = async (e) => {
    e.preventDefault();
    
    try {
      // First, prepare the donation data for the donations table
      const donationData = {
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone,
        donation_type: 'Items',
        items_description: `${itemQuantity} ${itemCategory}: ${itemDescription}`,
        status: 'Pending',
        notes: deliveryMethod === 'pickup' ? 
          `Pickup requested: ${pickupDate} at ${pickupAddress}` : 
          'Drop-off'
      };
      
      // Save to donations table
      const { error: donationError } = await supabase
        .from('donations')
        .insert([donationData]);
        
      if (donationError) throw donationError;
      
      // If this is a pledge for a specific wishlist item
      if (selectedRequestId) {
        const pledgeData = {
          inventory_request_id: selectedRequestId,
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone,
        quantity: parseInt(itemQuantity),
        delivery_method: deliveryMethod,
        message: itemDescription
      };
      
      // Add pickup info if relevant
      if (deliveryMethod === "pickup") {
          pledgeData.pickup_date = pickupDate;
          pledgeData.pickup_address = pickupAddress;
      }
        
        // Save to donation_pledges table
        const { error: pledgeError } = await supabase
          .from('donation_pledges')
          .insert([pledgeData]);
          
        if (pledgeError) throw pledgeError;
      }
      
      toast.success("Thank you for your donation! We'll be in touch soon.");
      
      // Reset form
      setItemCategory("");
      setItemQuantity("");
      setItemDescription("");
      setDeliveryMethod("dropoff");
      setPickupDate("");
      setPickupAddress("");
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setSelectedRequestId(null);
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast.error("There was a problem submitting your donation. Please try again.");
    }
  };
  
  // Handle wishlist fulfillment
  const handleWishlistFulfill = (item) => {
    if (item) {
      setItemCategory(item.category);
      setItemQuantity(item.quantity_needed.toString());
      setItemDescription(`I'm donating for the requested "${item.item_name}"`);
      setSelectedRequestId(item.id);
      setDonationType("physical");
      
      toast.info(`You're fulfilling: ${item.quantity_needed} ${item.item_name}`);
      
      // Scroll to the physical donation form
      document.getElementById("physical-donation-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-family-cream">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-12 md:py-20 bg-family-warm">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Make a Difference Today</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Your generous support helps us provide care, education, and love to children who need it most.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="btn-primary flex items-center gap-2"
                onClick={() => document.getElementById("donation-tabs")?.scrollIntoView({ behavior: "smooth" })}
              >
                <HandCoins className="w-5 h-5" />
                Donate Now
              </Button>
              <Button 
                variant="outline" 
                className="btn-secondary flex items-center gap-2"
                onClick={() => document.getElementById("wishlist-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Heart className="w-5 h-5" />
                View Wishlist
              </Button>
            </div>
          </div>
        </section>
        
        {/* Donation Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center glass-panel">
                <CardHeader>
                  <DollarSign className="w-10 h-10 mx-auto text-family-accent" />
                  <CardTitle>${donationStats.monetaryTotal.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-family-text-light">Total Donations Received</p>
                </CardContent>
              </Card>
              
              <Card className="text-center glass-panel">
                <CardHeader>
                  <UserPlus className="w-10 h-10 mx-auto text-family-accent" />
                  <CardTitle>{donationStats.childrenSupported}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-family-text-light">Children Supported</p>
                </CardContent>
              </Card>
              
              <Card className="text-center glass-panel">
                <CardHeader>
                  <Package className="w-10 h-10 mx-auto text-family-accent" />
                  <CardTitle>{donationStats.physicalItems}+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-family-text-light">Physical Items Donated</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Donation Forms */}
        <section className="py-12 bg-family-cream" id="donation-tabs">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-bold mb-8 text-center">How Would You Like to Donate?</h2>
            
            <Tabs defaultValue="monetary" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger 
                  value="monetary" 
                  onClick={() => setDonationType("monetary")}
                  className="flex items-center gap-2"
                >
                  <PiggyBank className="w-4 h-4" />
                  <span>Monetary Donation</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="physical" 
                  onClick={() => setDonationType("physical")}
                  className="flex items-center gap-2"
                >
                  <GiftIcon className="w-4 h-4" />
                  <span>Physical Donation</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="monetary">
                <Card>
                  <CardHeader>
                    <CardTitle>Monetary Donation</CardTitle>
                    <CardDescription>
                      Your financial support helps us provide care, education, and resources for our children.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMonetaryDonation}>
                      <div className="space-y-6">
                        {/* Donor Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Your Information</h3>
                          
                          <div>
                            <Label htmlFor="donor-name-monetary">Name *</Label>
                            <Input
                              id="donor-name-monetary"
                              placeholder="Your name"
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="donor-email-monetary">Email *</Label>
                            <Input
                              id="donor-email-monetary"
                              type="email"
                              placeholder="Your email"
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="donor-phone-monetary">Phone (Optional)</Label>
                            <Input
                              id="donor-phone-monetary"
                              placeholder="Your phone number"
                              value={donorPhone}
                              onChange={(e) => setDonorPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Donation Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Donation Details</h3>
                          
                        <div>
                            <Label htmlFor="donation-amount">Donation Amount ($) *</Label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <DollarSign className="w-5 h-5 text-gray-400" />
                            </div>
                            <Input
                              id="donation-amount"
                              type="number"
                              placeholder="Enter amount"
                              className="pl-10"
                              value={donationAmount}
                              onChange={(e) => setDonationAmount(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Donation Frequency</Label>
                          <RadioGroup 
                            className="grid grid-cols-2 gap-4 mt-2"
                            value={donationFrequency}
                            onValueChange={setDonationFrequency}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="one-time" id="one-time" />
                              <Label htmlFor="one-time">One-time</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="monthly" id="monthly" />
                              <Label htmlFor="monthly">Monthly</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Add a message to your donation"
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                          />
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full mt-6">
                        Proceed to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="physical" id="physical-donation-form">
                <Card>
                  <CardHeader>
                    <CardTitle>Physical Donation</CardTitle>
                    <CardDescription>
                      Donate clothes, books, food, and other essentials to help our children.
                      {selectedRequestId && (
                        <p className="text-sm font-medium mt-2 text-primary">
                          You're fulfilling a wishlist item
                        </p>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePhysicalDonation}>
                      <div className="space-y-6">
                        {/* Donor Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Your Information</h3>
                          
                          <div>
                            <Label htmlFor="donor-name">Name *</Label>
                            <Input
                              id="donor-name"
                              placeholder="Your name"
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="donor-email">Email *</Label>
                            <Input
                              id="donor-email"
                              type="email"
                              placeholder="Your email"
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="donor-phone">Phone (Optional)</Label>
                            <Input
                              id="donor-phone"
                              placeholder="Your phone number"
                              value={donorPhone}
                              onChange={(e) => setDonorPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        {/* Donation Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Donation Details</h3>
                          
                          {!selectedRequestId && (
                            <div>
                              <Label htmlFor="item-category">Item Category *</Label>
                              <Select 
                                value={itemCategory} 
                                onValueChange={setItemCategory}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Clothes">Clothes</SelectItem>
                                  <SelectItem value="Books">Books</SelectItem>
                                  <SelectItem value="Food">Food</SelectItem>
                                  <SelectItem value="Toys">Toys</SelectItem>
                                  <SelectItem value="Stationery">Stationery</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          <div>
                            <Label htmlFor="item-quantity">Quantity *</Label>
                            <Input
                              id="item-quantity"
                              type="number"
                              placeholder="Enter quantity"
                              value={itemQuantity}
                              onChange={(e) => setItemQuantity(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="item-description">Item Description *</Label>
                            <Textarea
                              id="item-description"
                              placeholder="Describe the items you're donating"
                              value={itemDescription}
                              onChange={(e) => setItemDescription(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Delivery Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Delivery Method</h3>
                          
                          <div>
                            <RadioGroup 
                              className="grid grid-cols-2 gap-4 mt-2"
                              value={deliveryMethod}
                              onValueChange={setDeliveryMethod}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dropoff" id="dropoff" />
                                <Label htmlFor="dropoff">Drop-off</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pickup" id="pickup" />
                                <Label htmlFor="pickup">Request Pickup</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          {deliveryMethod === "pickup" && (
                            <>
                              <div>
                                <Label htmlFor="pickup-date">Preferred Pickup Date *</Label>
                                <div className="relative mt-1">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <Input
                                    id="pickup-date"
                                    type="date"
                                    className="pl-10"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="pickup-address">Pickup Address *</Label>
                                <Textarea
                                  id="pickup-address"
                                  placeholder="Enter your address for pickup"
                                  value={pickupAddress}
                                  onChange={(e) => setPickupAddress(e.target.value)}
                                  required
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full mt-6">
                        Submit Donation
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Wishlist Section */}
        <section className="py-12 bg-family-soft-blue" id="wishlist-section">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Current Needs</h2>
              <p className="text-lg text-family-text-light max-w-2xl mx-auto">
                These are items our children currently need. Your help in fulfilling these specific requests is greatly appreciated.
              </p>
            </div>
            
            {isLoadingWishlist ? (
              <div className="text-center py-12">
                <p>Loading wishlist items...</p>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-family-text-light">No items on the wishlist at this time. Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="glass-panel">
                    <CardHeader className="relative pb-2">
                      {item.priority === "Critical" && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgent Need
                          </div>
                        </div>
                      )}
                      <CardTitle className="text-xl">{item.item_name}</CardTitle>
                      <CardDescription>{item.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p>Quantity needed: <span className="font-medium">{item.quantity_needed - item.quantity_fulfilled} {item.unit}</span></p>
                        {item.description && (
                          <p className="text-sm text-family-text-light">{item.description}</p>
                        )}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, Math.round((item.quantity_fulfilled / item.quantity_needed) * 100))}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{item.quantity_fulfilled} fulfilled</span>
                          <span>{item.quantity_needed} needed</span>
                        </div>
                        <p className="text-sm text-family-text-light mt-2">
                          Priority: <span className={`font-medium ${
                            item.priority === "Critical" ? "text-red-600" : 
                            item.priority === "High" ? "text-orange-600" : 
                            "text-blue-600"
                          }`}>{item.priority}</span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleWishlistFulfill(item)}
                        disabled={item.quantity_fulfilled >= item.quantity_needed}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{item.quantity_fulfilled >= item.quantity_needed ? "Need Fulfilled" : "Fulfill This Need"}</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonationPage;