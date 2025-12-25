import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Search, Filter, Pencil, Trash, User, Calendar, MapPin, Heart, School, Activity, Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ChildManagement = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [childToEdit, setChildToEdit] = useState(null);
  const [childToDelete, setChildToDelete] = useState(null);
  const [childStats, setChildStats] = useState({
    total: 0,
    inAdoption: 0,
    inSchool: 0,
    medicalNeeds: 0
  });
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    background: "",
    health_status: "",
    education_level: "",
    special_needs: false,
    special_needs_details: "",
    interests: [],
    photo_url: "",
    status: "Available" // Available, In Adoption Process, Adopted
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setChildren(data || []);
      
      // Calculate stats
      const stats = {
        total: data?.length || 0,
        inAdoption: data?.filter(child => child.status === 'In Adoption Process')?.length || 0,
        inSchool: data?.filter(child => child.education_level && child.education_level !== 'None')?.length || 0,
        medicalNeeds: data?.filter(child => child.special_needs)?.length || 0
      };
      
      setChildStats(stats);
    } catch (error) {
      console.error('Error fetching children:', error);
      alert('Could not load children data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestsChange = (e) => {
    const value = e.target.value;
    // Split by commas and trim each item
    const interestsArray = value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, interests: interestsArray }));
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      age: "",
      gender: "",
      background: "",
      health_status: "",
      education_level: "",
      special_needs: false,
      special_needs_details: "",
      interests: [],
      photo_url: "",
      status: "Available"
    });
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Convert age to number
      const ageAsNumber = parseInt(formData.age, 10);
      if (isNaN(ageAsNumber)) {
        throw new Error('Age must be a number');
      }

      const { data, error } = await supabase
        .from('children')
        .insert([{ ...formData, age: ageAsNumber }])
        .select();

      if (error) throw error;

      setChildren(prev => [data[0], ...prev]);
      alert('Child added successfully');
      setIsAddOpen(false);
      resetForm();
      fetchChildren(); // Refresh data
    } catch (error) {
      console.error('Error adding child:', error);
      alert(error.message || 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (child) => {
    setChildToEdit(child);
    setFormData({
      full_name: child.full_name,
      age: child.age.toString(),
      gender: child.gender,
      background: child.background || "",
      health_status: child.health_status || "",
      education_level: child.education_level || "",
      special_needs: child.special_needs || false,
      special_needs_details: child.special_needs_details || "",
      interests: child.interests || [],
      photo_url: child.photo_url || "",
      status: child.status || "Available"
    });
    setIsEditOpen(true);
  };

  const handleUpdateChild = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Convert age to number
      const ageAsNumber = parseInt(formData.age, 10);
      if (isNaN(ageAsNumber)) {
        throw new Error('Age must be a number');
      }

      const { error } = await supabase
        .from('children')
        .update({ ...formData, age: ageAsNumber })
        .eq('id', childToEdit.id);

      if (error) throw error;

      alert('Child updated successfully');
      setIsEditOpen(false);
      resetForm();
      fetchChildren(); // Refresh data
    } catch (error) {
      console.error('Error updating child:', error);
      alert(error.message || 'Failed to update child');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (child) => {
    setChildToDelete(child);
    if (confirm(`Are you sure you want to delete ${child.full_name}?`)) {
      handleDeleteChild(child.id);
    }
  };

  const handleDeleteChild = async (id) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setChildren(prev => prev.filter(child => child.id !== id));
      alert('Child deleted successfully');
      fetchChildren(); // Refresh data
    } catch (error) {
      console.error('Error deleting child:', error);
      alert('Failed to delete child');
    } finally {
      setIsDeleting(false);
      setChildToDelete(null);
    }
  };
  
  // Filter function
  const filteredChildren = children.filter(child => {
    const matchesSearch = child.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         child.background?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || child.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    let color = "bg-gray-100 text-gray-800";
    
    if (status === "Available") {
      color = "bg-green-100 text-green-800";
    } else if (status === "In Adoption Process") {
      color = "bg-blue-100 text-blue-800";
    } else if (status === "Adopted") {
      color = "bg-purple-100 text-purple-800";
    }
    
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Child Management</h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search children..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Adoption Process">In Process</SelectItem>
                <SelectItem value="Adopted">Adopted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Child</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add New Child</SheetTitle>
                <SheetDescription>
                  Add a new child to the system. Fill in all the required information.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleAddChild} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input 
                    id="full_name" 
                    name="full_name"
                    placeholder="Full name" 
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input 
                      id="age" 
                      name="age"
                      type="number" 
                      placeholder="Age" 
                      required
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      required
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="background">Background</Label>
                  <Textarea 
                    id="background" 
                    name="background"
                    placeholder="Brief background story" 
                    value={formData.background}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health_status">Health Status</Label>
                  <Input 
                    id="health_status" 
                    name="health_status"
                    placeholder="Health status" 
                    value={formData.health_status}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education_level">Education Level</Label>
                  <Input 
                    id="education_level" 
                    name="education_level"
                    placeholder="Current education level" 
                    value={formData.education_level}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="special_needs" 
                    name="special_needs"
                    checked={formData.special_needs}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, special_needs: checked }))}
                  />
                  <Label htmlFor="special_needs">Has Special Needs</Label>
                </div>
                {formData.special_needs && (
                  <div className="space-y-2">
                    <Label htmlFor="special_needs_details">Special Needs Details</Label>
                    <Textarea 
                      id="special_needs_details" 
                      name="special_needs_details"
                      placeholder="Describe the special needs" 
                      value={formData.special_needs_details}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests (comma separated)</Label>
                  <Input 
                    id="interests" 
                    name="interests"
                    placeholder="Reading, Drawing, Sports" 
                    value={formData.interests.join(', ')}
                    onChange={handleInterestsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo_url">Photo URL</Label>
                  <Input 
                    id="photo_url" 
                    name="photo_url"
                    type="url"
                    placeholder="https://example.com/photo.jpg" 
                    value={formData.photo_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Adoption Process">In Adoption Process</SelectItem>
                      <SelectItem value="Adopted">Adopted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Child"
                    )}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
          
          {/* Edit Child Sheet */}
          <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Child</SheetTitle>
                <SheetDescription>
                  Update child information.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleUpdateChild} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_full_name">Full Name *</Label>
                  <Input 
                    id="edit_full_name" 
                    name="full_name"
                    placeholder="Full name" 
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_age">Age *</Label>
                    <Input 
                      id="edit_age" 
                      name="age"
                      type="number" 
                      placeholder="Age" 
                      required
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_gender">Gender *</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      required
                    >
                      <SelectTrigger id="edit_gender">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Include the same fields as the add form */}
                <div className="space-y-2">
                  <Label htmlFor="edit_background">Background</Label>
                  <Textarea 
                    id="edit_background" 
                    name="background"
                    placeholder="Brief background story" 
                    value={formData.background}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_health_status">Health Status</Label>
                  <Input 
                    id="edit_health_status" 
                    name="health_status"
                    placeholder="Health status" 
                    value={formData.health_status}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_education_level">Education Level</Label>
                  <Input 
                    id="edit_education_level" 
                    name="education_level"
                    placeholder="Current education level" 
                    value={formData.education_level}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit_special_needs" 
                    name="special_needs"
                    checked={formData.special_needs}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, special_needs: checked }))}
                  />
                  <Label htmlFor="edit_special_needs">Has Special Needs</Label>
                </div>
                {formData.special_needs && (
                  <div className="space-y-2">
                    <Label htmlFor="edit_special_needs_details">Special Needs Details</Label>
                    <Textarea 
                      id="edit_special_needs_details" 
                      name="special_needs_details"
                      placeholder="Describe the special needs" 
                      value={formData.special_needs_details}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="edit_interests">Interests (comma separated)</Label>
                  <Input 
                    id="edit_interests" 
                    name="interests"
                    placeholder="Reading, Drawing, Sports" 
                    value={formData.interests.join(', ')}
                    onChange={handleInterestsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_photo_url">Photo URL</Label>
                  <Input 
                    id="edit_photo_url" 
                    name="photo_url"
                    type="url"
                    placeholder="https://example.com/photo.jpg" 
                    value={formData.photo_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="edit_status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Adoption Process">In Adoption Process</SelectItem>
                      <SelectItem value="Adopted">Adopted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Child"
                    )}
                  </Button>
              </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Children</p>
                <p className="text-2xl font-bold">{childStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-10 w-10 text-red-500 bg-red-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Adoption Process</p>
                <p className="text-2xl font-bold">{childStats.inAdoption}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <School className="h-10 w-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In School</p>
                <p className="text-2xl font-bold">{childStats.inSchool}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-10 w-10 text-green-500 bg-green-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Special Needs</p>
                <p className="text-2xl font-bold">{childStats.medicalNeeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Children Table */}
      <Card>
        <CardHeader>
          <CardTitle>Children</CardTitle>
          <CardDescription>View and manage all children in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && children.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading children data...</span>
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No children found. Add a child to get started.</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Background</TableHead>
                <TableHead>Education</TableHead>
                  <TableHead>Health</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChildren.map((child) => (
                <TableRow key={child.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {child.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                          <p className="font-medium">{child.full_name}</p>
                        <p className="text-xs text-muted-foreground">{child.gender}, {child.age} years</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{child.age}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={child.background}>
                      {child.background || 'N/A'}
                    </TableCell>
                    <TableCell>{child.education_level || 'N/A'}</TableCell>
                    <TableCell>
                      {child.special_needs ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Special Needs
                        </span>
                      ) : (
                        child.health_status || 'Healthy'
                      )}
                  </TableCell>
                    <TableCell><StatusBadge status={child.status || 'Available'} /></TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(child)}
                        >
                        <Pencil className="h-4 w-4" />
                      </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(child)}
                          disabled={isDeleting && childToDelete?.id === child.id}
                        >
                          {isDeleting && childToDelete?.id === child.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                        <Trash className="h-4 w-4" />
                          )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildManagement;
