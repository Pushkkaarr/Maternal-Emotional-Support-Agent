import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogIn, LogOut, Search, ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from '@supabase/ssr';
import { format } from "date-fns";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const InventoryMovements = () => {
  const [movements, setMovements] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [movementType, setMovementType] = useState("IN");
  
  // Form state
  const [formData, setFormData] = useState({
    inventory_id: "",
    quantity: "",
    movement_type: "IN",
    reason: "",
    notes: "",
    source_destination: ""
  });

  useEffect(() => {
    fetchMovements();
    fetchInventoryItems();
  }, []);

  const fetchMovements = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          inventory:inventory_id (item_name, unit)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMovements(data || []);
    } catch (error) {
      console.error('Error fetching movements:', error);
      alert('Could not load movement data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('id, item_name, unit, quantity')
        .order('item_name');

      if (error) throw error;

      setInventoryItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
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
      inventory_id: "",
      quantity: "",
      movement_type: "IN",
      reason: "",
      notes: "",
      source_destination: ""
    });
  };

  const handleAddMovement = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const quantityAsNumber = parseInt(formData.quantity, 10);
      
      if (isNaN(quantityAsNumber) || quantityAsNumber <= 0) {
        throw new Error('Quantity must be a positive number');
      }
      
      // Check if we have enough stock for an OUT movement
      if (formData.movement_type === 'OUT') {
        const selectedItem = inventoryItems.find(item => item.id === formData.inventory_id);
        if (selectedItem && selectedItem.quantity < quantityAsNumber) {
          throw new Error(`Not enough stock available. Current quantity: ${selectedItem.quantity}`);
        }
      }

      const { data, error } = await supabase
        .from('inventory_movements')
        .insert([{ 
          ...formData, 
          quantity: quantityAsNumber,
          moved_by: "Admin" // In a real app, you'd use the current user's name/ID
        }]);

      if (error) throw error;

      alert('Movement recorded successfully');
      setIsAddOpen(false);
      resetForm();
      fetchMovements(); // Refresh movement data
      fetchInventoryItems(); // Refresh inventory items to show updated quantities
    } catch (error) {
      console.error('Error adding movement:', error);
      alert(error.message || 'Failed to record movement');
    } finally {
      setIsLoading(false);
    }
  };

  // Movement type badge
  const MovementTypeBadge = ({ type }) => {
    const isIn = type === 'IN';
    const color = isIn ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    const Icon = isIn ? ArrowDownCircle : ArrowUpCircle;
    
    return (
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${color}`}>
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{isIn ? 'Stock In' : 'Stock Out'}</span>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Inventory Movements</h2>
        
        <div className="flex items-center space-x-2">
          <Select value={movementType} onValueChange={setMovementType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Movements</SelectItem>
              <SelectItem value="IN">Stock In</SelectItem>
              <SelectItem value="OUT">Stock Out</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-1">
                <LogIn className="h-4 w-4 mr-1" />
                <LogOut className="h-4 w-4" />
                <span className="ml-1">Record Movement</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Record Inventory Movement</SheetTitle>
                <SheetDescription>
                  Add stock in or out movements to track inventory changes.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleAddMovement} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="movement_type">Movement Type *</Label>
                  <Select 
                    value={formData.movement_type} 
                    onValueChange={(value) => handleSelectChange("movement_type", value)}
                    required
                  >
                    <SelectTrigger id="movement_type">
                      <SelectValue placeholder="Select Movement Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">Stock In</SelectItem>
                      <SelectItem value="OUT">Stock Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inventory_id">Item *</Label>
                  <Select 
                    value={formData.inventory_id} 
                    onValueChange={(value) => handleSelectChange("inventory_id", value)}
                    required
                  >
                    <SelectTrigger id="inventory_id">
                      <SelectValue placeholder="Select Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.item_name} ({item.quantity} {item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    name="quantity"
                    type="number" 
                    min="1"
                    placeholder="Quantity" 
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select 
                    value={formData.reason} 
                    onValueChange={(value) => handleSelectChange("reason", value)}
                    required
                  >
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="Select Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.movement_type === 'IN' ? (
                        <>
                          <SelectItem value="Donation">Donation</SelectItem>
                          <SelectItem value="Purchase">Purchase</SelectItem>
                          <SelectItem value="Return">Return</SelectItem>
                          <SelectItem value="Adjustment">Inventory Adjustment</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Consumption">Consumption</SelectItem>
                          <SelectItem value="Distribution">Distribution</SelectItem>
                          <SelectItem value="Damage">Damage/Loss</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                          <SelectItem value="Adjustment">Inventory Adjustment</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source_destination">
                    {formData.movement_type === 'IN' ? 'Source' : 'Destination'}
                  </Label>
                  <Input 
                    id="source_destination" 
                    name="source_destination"
                    placeholder={formData.movement_type === 'IN' ? 'Where did this come from?' : 'Where is this going?'} 
                    value={formData.source_destination}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes"
                    placeholder="Any additional details" 
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recording...
                      </>
                    ) : (
                      "Record Movement"
                    )}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Movements History</CardTitle>
          <CardDescription>Track all inventory ins and outs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && movements.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading movement data...</span>
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No movement records found. Record a movement to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>{movementType === 'IN' ? 'Source' : movementType === 'OUT' ? 'Destination' : 'Source/Destination'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements
                  .filter(movement => 
                    movementType === 'ALL' || movement.movement_type === movementType
                  )
                  .map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(movement.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{movement.inventory.item_name}</div>
                      </TableCell>
                      <TableCell>
                        <MovementTypeBadge type={movement.movement_type} />
                      </TableCell>
                      <TableCell>
                        {movement.quantity} {movement.inventory.unit}
                      </TableCell>
                      <TableCell>
                        {movement.reason}
                        {movement.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {movement.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{movement.source_destination || '-'}</TableCell>
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

export default InventoryMovements; 