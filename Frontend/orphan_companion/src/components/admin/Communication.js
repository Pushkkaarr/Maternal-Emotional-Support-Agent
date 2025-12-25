import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Communication = () => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailRecipient, setEmailRecipient] = useState("all");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Mock email sending functionality
    console.log("Sending mock email:", {
      subject: emailSubject,
      content: emailContent,
      recipient: emailRecipient
    });
    
    toast.success(`Email queued for sending to ${emailRecipient === "all" ? "all users" : emailRecipient}`);
    
    // Reset form
    setEmailSubject("");
    setEmailContent("");
    setEmailRecipient("all");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Communication Center</h2>
      <p className="text-muted-foreground">
        Send messages and updates to donors, adopters, and other stakeholders.
      </p>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Communication</CardTitle>
              <CardDescription>
                Compose and send emails to donors, adopters, or all users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Group</Label>
                  <Select value={emailRecipient} onValueChange={setEmailRecipient}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="donors">Donors Only</SelectItem>
                      <SelectItem value="adopters">Adopters Only</SelectItem>
                      <SelectItem value="volunteers">Volunteers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Email subject" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Type your message here..." 
                    className="min-h-[200px]"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => {
                    setEmailSubject("");
                    setEmailContent("");
                  }}>
                    Clear
                  </Button>
                  <Button type="submit">Send Email</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Send push notifications to users' devices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Push notification feature is coming soon.</p>
                <p className="text-sm text-muted-foreground mt-2">This will allow sending instant notifications to mobile and desktop devices.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>
                Post announcements to be displayed on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Announcement system is under development.</p>
                <p className="text-sm text-muted-foreground mt-2">This will enable you to post important updates that appear on the main dashboard.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communication;
