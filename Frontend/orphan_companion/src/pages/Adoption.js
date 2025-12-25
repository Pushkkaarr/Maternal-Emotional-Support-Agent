import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowRight, BadgeCheck, Calendar, Eye, GraduationCap, HandHeart, Heart, Loader2, MessageCircle, UserCheck, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createBrowserClient } from '@supabase/ssr';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import { config } from "../config/appConfig";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sample progress data
const progressData = [
  { id: 1, month: "January", health: 90, education: 85, activities: 75 },
  { id: 2, month: "February", health: 95, education: 80, activities: 80 },
  { id: 3, month: "March", health: 90, education: 90, activities: 85 },
  { id: 4, month: "April", health: 95, education: 95, activities: 90 },
];

const AdoptionPage = () => {
  // Form state
  const [adoptionType, setAdoptionType] = useState("virtual");
  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    financialInfo: "",
    sponsorshipAmount: "",
    sponsorshipDuration: "",
    message: ""
  });
  
  // Define default photo at the component level
  const defaultPhoto = 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=1470&auto=format&fit=crop';

  // Fetch children data from Supabase
  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .in('status', ['Available'])
        .eq('has_sponsor', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match the structure used in the component
      const transformedData = data.map(child => ({
        id: child.id,
        name: child.full_name,
        age: child.age,
        gender: child.gender,
        image: child.photo_url || defaultPhoto,
        story: child.background || 'No background information available',
        education: child.education_level || 'Not specified',
        hobbies: Array.isArray(child.interests) ? child.interests.join(', ') : (child.interests || 'Not specified'),
        health: child.health_status || 'Not specified',
        special_needs: child.special_needs,
        special_needs_details: child.special_needs_details,
        sponsor: child.sponsor_name
      }));

      setChildrenData(transformedData);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Unable to load children data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Select handler
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle full adoption application
  const handleFullAdoptionSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedChild) {
      toast.error("Please select a child first");
      return;
    }
    
    try {
      const selectedChildData = getSelectedChildData();
      
      // Save adoption application data to Supabase
      const { error } = await supabase
        .from('adoption_applications')
        .insert([{
          child_id: selectedChild,
          applicant_name: formData.fullName,
          applicant_email: formData.email,
          applicant_phone: formData.phone,
          address: formData.address,
          financial_info: formData.financialInfo,
          reason: formData.message,
          status: 'Pending Review',
          application_date: new Date().toISOString()
        }]);

      if (error) throw error;
      
      // Update the child's status in the children table
      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          status: 'In Adoption Process' 
        })
        .eq('id', selectedChild);
      
      if (updateError) throw updateError;

      toast.success(`Your adoption application for ${selectedChildData.name} has been submitted! Our team will contact you soon.`);
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        financialInfo: "",
        sponsorshipAmount: "",
        sponsorshipDuration: "",
        message: ""
      });
      setSelectedChild(null);
      
      // Refresh children data to show updated status
      fetchChildren();
    } catch (error) {
      console.error("Error submitting adoption application:", error);
      toast.error("There was a problem with your application. Please try again.");
    }
  };
  
  // Handle virtual adoption application
  const handleVirtualAdoptionSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedChild) {
      toast.error("Please select a child first");
      return;
    }

    try {
      const selectedChildData = getSelectedChildData();
      
      // Save sponsorship data to Supabase
      const { error } = await supabase
        .from('sponsorships')
        .insert([{
          child_id: selectedChild,
          sponsor_name: formData.fullName,
          sponsor_email: formData.email,
          sponsor_phone: formData.phone,
          monthly_amount: parseFloat(formData.sponsorshipAmount),
          duration_months: formData.sponsorshipDuration === 'ongoing' ? null : parseInt(formData.sponsorshipDuration),
          is_ongoing: formData.sponsorshipDuration === 'ongoing',
          message: formData.message,
          status: 'Active',
          start_date: new Date().toISOString()
        }]);

      if (error) throw error;
      
      // Also update the child's sponsor status in the children table
      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          has_sponsor: true,
          sponsor_name: formData.fullName
        })
        .eq('id', selectedChild);
      
      if (updateError) throw updateError;

      toast.success(`Thank you for sponsoring ${selectedChildData.name}! You'll receive details about your sponsored child soon.`);
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        financialInfo: "",
        sponsorshipAmount: "",
        sponsorshipDuration: "",
        message: ""
      });
      setSelectedChild(null);
      
      // Refresh children data to show updated sponsorship status
      fetchChildren();
    } catch (error) {
      console.error("Error submitting sponsorship:", error);
      toast.error("There was a problem with your sponsorship. Please try again.");
    }
  };
  
  // Select a child
  const handleSelectChild = (childId) => {
    setSelectedChild(childId);
    
    // Scroll to the form
    document.getElementById("adoption-form")?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Get selected child data
  const getSelectedChildData = () => {
    return childrenData.find(child => child.id === selectedChild);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-family-cream">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-12 md:py-20 bg-family-warm">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Give a Child a Family</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Whether through full adoption or virtual sponsorship, you can make a meaningful difference in a child's life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="btn-primary flex items-center gap-2"
                onClick={() => {
                  setAdoptionType("virtual");
                  document.getElementById("children-gallery")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <HandHeart className="w-5 h-5" />
                Sponsor a Child
              </Button>
              <Button 
                variant="outline" 
                className="btn-secondary flex items-center gap-2"
                onClick={() => {
                  setAdoptionType("full");
                  document.getElementById("children-gallery")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <UserPlus className="w-5 h-5" />
                Full Adoption
              </Button>
            </div>
          </div>
        </section>
        
        {/* Adoption Impact Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center glass-panel">
                <CardHeader>
                  <UserCheck className="w-10 h-10 mx-auto text-family-accent" />
                  <CardTitle>78</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-family-text-light">Children Successfully Adopted</p>
                </CardContent>
              </Card>
              
              <Card className="text-center glass-panel">
                <CardHeader>
                  <HandHeart className="w-10 h-10 mx-auto text-family-accent" />
                  <CardTitle>156</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-family-text-light">Ongoing Sponsorships</p>
                </CardContent>
              </Card>
              
              <Card className="text-center glass-panel">
                <CardHeader>
                  <GraduationCap className="w-10 h-10 mx-auto text-family-accent" />
                  <CardTitle>92%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-family-text-light">Education Success Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Children Gallery */}
        <section className="py-12 bg-family-cream" id="children-gallery">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Meet Our Children</h2>
              <p className="text-lg text-family-text-light max-w-2xl mx-auto">
                Each child is unique and special. Browse through their profiles to learn about their stories, interests, and dreams.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-family-text-light">Loading children profiles...</p>
              </div>
            ) : childrenData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-family-text-light mb-4">No children profiles available at the moment.</p>
                <p className="text-family-text-light">Please check back later or contact our office for more information.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {childrenData.map((child) => (
                  <Card key={child.id} className="glass-panel overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={child.image} 
                        alt={child.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultPhoto;
                        }}
                      />
                      {child.sponsor && (
                        <div className="absolute top-2 right-2 bg-family-accent text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          Sponsored
                        </div>
                      )}
                      {child.special_needs && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Special Needs
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{child.name}, {child.age}</CardTitle>
                      <CardDescription>{child.gender}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm line-clamp-3">{child.story}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>View Profile</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              {child.name}, {child.age}
                              {child.sponsor && (
                                <span className="bg-family-accent text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                  <BadgeCheck className="w-3 h-3 mr-1" />
                                  Sponsored by {child.sponsor}
                                </span>
                              )}
                              {child.special_needs && (
                                <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  Special Needs
                                </span>
                              )}
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="col-span-1">
                              <img 
                                src={child.image} 
                                alt={child.name}
                                className="w-full h-auto rounded-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultPhoto;
                                }}
                              />
                            </div>
                            <div className="col-span-2">
                              <h4 className="font-medium text-sm">About {child.name}</h4>
                              <p className="text-sm text-family-text-light mb-2">{child.story}</p>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Education:</span> {child.education}</p>
                                <p><span className="font-medium">Hobbies:</span> {child.hobbies}</p>
                                <p><span className="font-medium">Health:</span> {child.health}</p>
                                {child.special_needs && child.special_needs_details && (
                                  <p><span className="font-medium">Special Needs:</span> {child.special_needs_details}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                            {!child.sponsor && (
                              <AlertDialogAction onClick={() => handleSelectChild(child.id)}>
                                {adoptionType === "full" ? "Apply to Adopt" : "Sponsor"}
                              </AlertDialogAction>
                            )}
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      {!child.sponsor && (
                        <Button 
                          className="flex items-center gap-1"
                          size="sm"
                          onClick={() => handleSelectChild(child.id)}
                        >
                          {adoptionType === "full" ? (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>Adopt</span>
                            </>
                          ) : (
                            <>
                              <HandHeart className="w-3 h-3" />
                              <span>Sponsor</span>
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Adoption Form */}
        <section className="py-12 bg-family-soft-blue" id="adoption-form">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                {adoptionType === "full" ? "Full Adoption Application" : "Child Sponsorship"}
              </h2>
              <p className="text-lg text-family-text-light max-w-2xl mx-auto">
                {adoptionType === "full" 
                  ? "Complete this form to start the adoption process. Our team will review your application and contact you."
                  : "Sponsor a child to provide financial support for their education, healthcare, and daily needs."}
              </p>
            </div>
            
            {selectedChild ? (
              <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                <div className="lg:w-1/3">
                  <Card className="sticky top-20">
                    <CardHeader>
                      <CardTitle>Selected Child</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={getSelectedChildData()?.image} />
                          <AvatarFallback>{getSelectedChildData()?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{getSelectedChildData()?.name}, {getSelectedChildData()?.age}</h3>
                          <p className="text-sm text-family-text-light">{getSelectedChildData()?.gender}</p>
                        </div>
                      </div>
                      <p className="text-sm mb-4">{getSelectedChildData()?.story}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedChild(null)}
                      >
                        Change Selection
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:w-2/3">
                  <Tabs defaultValue={adoptionType} onValueChange={setAdoptionType}>
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="virtual" className="flex items-center gap-2">
                        <HandHeart className="w-4 h-4" />
                        <span>Virtual Sponsorship</span>
                      </TabsTrigger>
                      <TabsTrigger value="full" className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Full Adoption</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="virtual">
                      <Card>
                        <CardHeader>
                          <CardTitle>Sponsor {getSelectedChildData()?.name}</CardTitle>
                          <CardDescription>
                            Your monthly sponsorship will provide education, healthcare, nutrition, and more.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleVirtualAdoptionSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                  id="fullName"
                                  name="fullName"
                                  value={formData.fullName}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="sponsorshipAmount">Monthly Sponsorship Amount</Label>
                                <Select 
                                  value={formData.sponsorshipAmount} 
                                  onValueChange={value => handleSelectChange("sponsorshipAmount", value)}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select amount" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="30">$30 per month</SelectItem>
                                    <SelectItem value="50">$50 per month</SelectItem>
                                    <SelectItem value="100">$100 per month</SelectItem>
                                    <SelectItem value="custom">Custom amount</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="sponsorshipDuration">Sponsorship Duration</Label>
                                <Select 
                                  value={formData.sponsorshipDuration} 
                                  onValueChange={value => handleSelectChange("sponsorshipDuration", value)}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="6">6 months</SelectItem>
                                    <SelectItem value="12">1 year</SelectItem>
                                    <SelectItem value="24">2 years</SelectItem>
                                    <SelectItem value="ongoing">Ongoing until canceled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="message">Message for {getSelectedChildData()?.name} (Optional)</Label>
                                <Textarea
                                  id="message"
                                  name="message"
                                  placeholder="Write a message of encouragement"
                                  value={formData.message}
                                  onChange={handleChange}
                                  className="min-h-24"
                                />
                              </div>
                            </div>
                            
                            <div className="bg-family-beige/30 p-4 rounded-lg">
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                <span>You'll Receive:</span>
                              </h4>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                <li>Monthly updates about {getSelectedChildData()?.name}'s progress</li>
                                <li>Photos and letters from {getSelectedChildData()?.name}</li>
                                <li>The ability to send messages and gifts</li>
                                <li>Tax deduction receipts for your sponsorship</li>
                              </ul>
                            </div>
                            
                            <Button type="submit" className="w-full">
                              Complete Sponsorship
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                      
                      {/* Sponsorship Progress Tracking */}
                      <div className="mt-8">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Sample Progress Tracking</CardTitle>
                            <CardDescription>
                              As a sponsor, you'll receive monthly progress updates like this.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              {progressData.map((month) => (
                                <div key={month.id}>
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">{month.month} Progress Report</h4>
                                    <span className="text-xs bg-family-beige px-2 py-1 rounded-full">
                                      {new Date().getFullYear()}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>Health & Nutrition</span>
                                        <span>{month.health}%</span>
                                      </div>
                                      <Progress value={month.health} className="h-2" />
                                    </div>
                                    
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>Education</span>
                                        <span>{month.education}%</span>
                                      </div>
                                      <Progress value={month.education} className="h-2" />
                                    </div>
                                    
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>Activities & Social</span>
                                        <span>{month.activities}%</span>
                                      </div>
                                      <Progress value={month.activities} className="h-2" />
                                    </div>
                                  </div>
                                  
                                  {month.id !== progressData.length && <Separator className="my-4" />}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="full">
                      <Card>
                        <CardHeader>
                          <CardTitle>Full Adoption Application</CardTitle>
                          <CardDescription>
                            This is the first step in the adoption process. After review, our team will contact you for further steps.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleFullAdoptionSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                  id="fullName"
                                  name="fullName"
                                  value={formData.fullName}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="address">Complete Address</Label>
                                <Textarea
                                  id="address"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="financialInfo">Financial Information</Label>
                                <Textarea
                                  id="financialInfo"
                                  name="financialInfo"
                                  placeholder="Please provide brief information about your financial situation"
                                  value={formData.financialInfo}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="message">Why do you want to adopt {getSelectedChildData()?.name}?</Label>
                                <Textarea
                                  id="message"
                                  name="message"
                                  placeholder="Share your reasons and how you can provide a loving home"
                                  value={formData.message}
                                  onChange={handleChange}
                                  className="min-h-32"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="bg-family-beige/30 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Next Steps in the Adoption Process:</h4>
                              <ol className="list-decimal pl-5 text-sm space-y-1">
                                <li>Application review (1-2 weeks)</li>
                                <li>Initial interview (virtual or in-person)</li>
                                <li>Home study and background check</li>
                                <li>Meeting with {getSelectedChildData()?.name}</li>
                                <li>Final approval and legal processing</li>
                                <li>Transition period and placement</li>
                              </ol>
                            </div>
                            
                            <Button type="submit" className="w-full">
                              Submit Application
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto glass-panel p-8 rounded-xl">
                <h3 className="text-xl font-medium mb-4">Start Your Journey</h3>
                <p className="mb-6 text-family-text-light">
                  Please select a child from the gallery above to proceed with {adoptionType === "full" ? "adoption" : "sponsorship"}.
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("children-gallery")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Go to Children Gallery</span>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdoptionPage;
