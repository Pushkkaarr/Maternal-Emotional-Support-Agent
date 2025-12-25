import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Package, Search, Filter, Plus, Pencil, Trash, ArrowDown, ArrowUp, ShoppingBag, BookOpen, Shirt, Coffee, Gamepad, Loader2, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createBrowserClient } from '@supabase/ssr';
import InventoryMovements from "./InventoryMovements";
import InventoryRequests from "./InventoryRequests";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CATEGORIES = [
  { value: "School Supplies", label: "School Supplies" },
  { value: "Clothing", label: "Clothing" },
  { value: "Food", label: "Food" },
  { value: "Medical", label: "Medical" },
  { value: "Bedding", label: "Bedding" },
  { value: "Toys", label: "Toys" },
  { value: "Hygiene", label: "Hygiene" },
  { value: "Other", label: "Other" },
];

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [inventoryStats, setInventoryStats] = useState({
    total: 0,
    clothing: 0,
    food: 0,
    lowStock: 0
  });
  const [activeTab, setActiveTab] = useState("inventory");
  
  // Form state
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    unit: "",
    description: "",
    condition: "New",
    location: "",
    supplier: "",
    minimum_stock: "0",
    cost: ""
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInventoryItems(data || []);
      
      // Calculate stats
      const stats = {
        total: data?.reduce((acc, item) => acc + item.quantity, 0) || 0,
        clothing: data?.filter(item => item.category === 'Clothing')?.reduce((acc, item) => acc + item.quantity, 0) || 0,
        food: data?.filter(item => item.category === 'Food')?.reduce((acc, item) => acc + item.quantity, 0) || 0,
        lowStock: data?.filter(item => item.quantity <= item.minimum_stock)?.length || 0
      };
      
      setInventoryStats(stats);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Could not load inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      item_name: "",
      category: "",
      quantity: "",
      unit: "",
      description: "",
      condition: "New",
      location: "",
      supplier: "",
      minimum_stock: "0",
      cost: ""
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Convert numeric fields
      const quantityAsNumber = parseInt(formData.quantity, 10);
      const minimumStockAsNumber = parseInt(formData.minimum_stock, 10);
      const costAsNumber = formData.cost ? parseFloat(formData.cost) : null;
      
      if (isNaN(quantityAsNumber) || isNaN(minimumStockAsNumber)) {
        throw new Error('Quantity and minimum stock must be numbers');
      }

      const { data, error } = await supabase
        .from('inventory')
        .insert([{ 
          ...formData, 
          quantity: quantityAsNumber,
          minimum_stock: minimumStockAsNumber,
          cost: costAsNumber
        }])
        .select();

      if (error) throw error;

      alert('Item added successfully');
      setIsAddOpen(false);
      resetForm();
      fetchInventory(); // Refresh data
    } catch (error) {
      console.error('Error adding item:', error);
      alert(error.message || 'Failed to add item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setFormData({
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit || "",
      description: item.description || "",
      condition: item.condition || "New",
      location: item.location || "",
      supplier: item.supplier || "",
      minimum_stock: item.minimum_stock ? item.minimum_stock.toString() : "0",
      cost: item.cost ? item.cost.toString() : ""
    });
    setIsEditOpen(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Convert numeric fields
      const quantityAsNumber = parseInt(formData.quantity, 10);
      const minimumStockAsNumber = parseInt(formData.minimum_stock, 10);
      const costAsNumber = formData.cost ? parseFloat(formData.cost) : null;
      
      if (isNaN(quantityAsNumber) || isNaN(minimumStockAsNumber)) {
        throw new Error('Quantity and minimum stock must be numbers');
      }

      const { error } = await supabase
        .from('inventory')
        .update({ 
          ...formData, 
          quantity: quantityAsNumber,
          minimum_stock: minimumStockAsNumber,
          cost: costAsNumber
        })
        .eq('id', itemToEdit.id);

      if (error) throw error;

      alert('Item updated successfully');
      setIsEditOpen(false);
      resetForm();
      fetchInventory(); // Refresh data
    } catch (error) {
      console.error('Error updating item:', error);
      alert(error.message || 'Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    if (confirm(`Are you sure you want to delete ${item.item_name}?`)) {
      handleDeleteItem(item.id);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Item deleted successfully');
      fetchInventory(); // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };
  
  // Filter function
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Status badge component
  const StatusBadge = ({ quantity, minimumStock }) => {
    let status = "In Stock";
    let color = "bg-green-100 text-green-800";
    
    if (quantity <= 0) {
      status = "Out of Stock";
      color = "bg-red-100 text-red-800";
    } else if (quantity <= minimumStock) {
      status = "Low Stock";
      color = "bg-yellow-100 text-yellow-800";
    }
    
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  };

  // Category icon
  const CategoryIcon = ({ category }) => {
    switch (category) {
      case "Clothing":
        return <Shirt className="h-4 w-4" />;
      case "Food":
        return <Coffee className="h-4 w-4" />;
      case "School Supplies":
        return <BookOpen className="h-4 w-4" />;
      case "Toys":
        return <Gamepad className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        
        <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger value="inventory">Inventory Stock</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="requests">Donation Wishlist</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
            <div className="flex items-center space-x-2">
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </Button>
            </SheetTrigger>
                <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add Inventory Item</SheetTitle>
                <SheetDescription>
                      Add a new item to the inventory.
                </SheetDescription>
              </SheetHeader>
                  <form onSubmit={handleAddItem} className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="item_name">Item Name *</Label>
                      <Input 
                        id="item_name" 
                        name="item_name"
                        placeholder="Item name" 
                        required
                        value={formData.item_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input 
                          id="quantity" 
                          name="quantity"
                          type="number" 
                          placeholder="Quantity" 
                          required
                          value={formData.quantity}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input 
                          id="unit" 
                          name="unit"
                          placeholder="pieces, kg, liters, etc." 
                          value={formData.unit}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        placeholder="Item description" 
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                </div>
                <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select 
                        value={formData.condition} 
                        onValueChange={(value) => handleSelectChange("condition", value)}
                      >
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Select Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                </div>
                <div className="space-y-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="Where is this item stored" 
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                </div>
                <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier/Donor</Label>
                      <Input 
                        id="supplier" 
                        name="supplier"
                        placeholder="Where did this item come from" 
                        value={formData.supplier}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minimum_stock">Minimum Stock</Label>
                        <Input 
                          id="minimum_stock" 
                          name="minimum_stock"
                          type="number" 
                          placeholder="0" 
                          value={formData.minimum_stock}
                          onChange={handleInputChange}
                        />
                </div>
                <div className="space-y-2">
                        <Label htmlFor="cost">Cost (if purchased)</Label>
                        <Input 
                          id="cost" 
                          name="cost"
                          type="number" 
                          step="0.01"
                          placeholder="Item cost" 
                          value={formData.cost}
                          onChange={handleInputChange}
                        />
                      </div>
                </div>
                
                <div className="pt-4">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add to Inventory"
                        )}
                      </Button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>
              
              {/* Edit Item Sheet */}
              <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Edit Inventory Item</SheetTitle>
                    <SheetDescription>
                      Update item information.
                    </SheetDescription>
                  </SheetHeader>
                  <form onSubmit={handleUpdateItem} className="grid gap-4 py-4">
                    {/* Same fields as add form */}
                    <div className="space-y-2">
                      <Label htmlFor="edit_item_name">Item Name *</Label>
                      <Input 
                        id="edit_item_name" 
                        name="item_name"
                        placeholder="Item name" 
                        required
                        value={formData.item_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_category">Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger id="edit_category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit_quantity">Quantity *</Label>
                        <Input 
                          id="edit_quantity" 
                          name="quantity"
                          type="number" 
                          placeholder="Quantity" 
                          required
                          value={formData.quantity}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_unit">Unit</Label>
                        <Input 
                          id="edit_unit" 
                          name="unit"
                          placeholder="pieces, kg, liters, etc." 
                          value={formData.unit}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_description">Description</Label>
                      <Textarea 
                        id="edit_description" 
                        name="description"
                        placeholder="Item description" 
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_condition">Condition</Label>
                      <Select 
                        value={formData.condition} 
                        onValueChange={(value) => handleSelectChange("condition", value)}
                      >
                        <SelectTrigger id="edit_condition">
                          <SelectValue placeholder="Select Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_location">Storage Location</Label>
                      <Input 
                        id="edit_location" 
                        name="location"
                        placeholder="Where is this item stored" 
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_supplier">Supplier/Donor</Label>
                      <Input 
                        id="edit_supplier" 
                        name="supplier"
                        placeholder="Where did this item come from" 
                        value={formData.supplier}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit_minimum_stock">Minimum Stock</Label>
                        <Input 
                          id="edit_minimum_stock" 
                          name="minimum_stock"
                          type="number" 
                          placeholder="0" 
                          value={formData.minimum_stock}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_cost">Cost (if purchased)</Label>
                        <Input 
                          id="edit_cost" 
                          name="cost"
                          type="number" 
                          step="0.01"
                          placeholder="Item cost" 
                          value={formData.cost}
                          onChange={handleInputChange}
                        />
                </div>
              </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Item"
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
              <Package className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{inventoryStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shirt className="h-10 w-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
              <div>
                    <p className="text-sm font-medium text-muted-foreground">Clothing</p>
                    <p className="text-2xl font-bold">{inventoryStats.clothing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
                  <Coffee className="h-10 w-10 text-purple-500 bg-purple-100 p-2 rounded-full" />
              <div>
                    <p className="text-sm font-medium text-muted-foreground">Food</p>
                    <p className="text-2xl font-bold">{inventoryStats.food}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-10 w-10 text-orange-500 bg-orange-100 p-2 rounded-full" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold">{inventoryStats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>View and manage all items in inventory</CardDescription>
        </CardHeader>
        <CardContent>
              {isLoading && inventoryItems.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading inventory data...</span>
                </div>
              ) : inventoryItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No inventory items found. Add an item to get started.</p>
                </div>
              ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                      <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{item.item_name}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <CategoryIcon category={item.category} />
                      {item.category}
                    </div>
                  </TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>{item.location || 'Not specified'}</TableCell>
                        <TableCell>
                          <StatusBadge quantity={item.quantity} minimumStock={item.minimum_stock || 0} />
                        </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditClick(item)}
                            >
                        <Pencil className="h-4 w-4" />
                      </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteClick(item)}
                              disabled={isDeleting && itemToDelete?.id === item.id}
                            >
                              {isDeleting && itemToDelete?.id === item.id ? (
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
        </TabsContent>
        
        <TabsContent value="movements">
          <InventoryMovements />
        </TabsContent>
        
        <TabsContent value="requests">
          <InventoryRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
