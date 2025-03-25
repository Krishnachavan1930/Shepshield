
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile settings saved successfully.');
    }, 1000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Notification settings updated successfully.');
    }, 1000);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Account settings updated successfully.');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Dr. John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@sepsiscare.med" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input id="specialty" defaultValue="Infectious Disease" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Specialist in infectious diseases with over 15 years of experience in sepsis diagnosis and treatment."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile image</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&auto=format&fit=crop" 
                  alt="Profile"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="picture">Upload new picture</Label>
                  <Input id="picture" type="file" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Recommended dimensions: 256x256px. Maximum file size: 2MB.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Remove</Button>
                  <Button>Upload</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotifications}>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Patient Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts when a patient's sepsis risk increases</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">System Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-medium">In-App Notifications</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Real-time Alerts</Label>
                        <p className="text-sm text-muted-foreground">Show alerts in real-time within the application</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Patient Updates</Label>
                        <p className="text-sm text-muted-foreground">Notify when patient information is updated</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">System Messages</Label>
                        <p className="text-sm text-muted-foreground">Receive system messages and announcements</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Password</h3>
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <h3 className="text-sm font-medium">Session</h3>
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="America/New_York">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-logout</Label>
                        <p className="text-sm text-muted-foreground">Automatically log out after 1 hour of inactivity</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Log Out of All Devices</h4>
                    <p className="text-sm text-muted-foreground">End all active sessions on other devices</p>
                  </div>
                  <Button variant="outline">Log Out All</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks on your device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">
                      <span className="h-4 w-4 rounded-full bg-background mr-2 border"></span>
                      Light
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="h-4 w-4 rounded-full bg-black mr-2"></span>
                      Dark
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="h-4 w-4 rounded-full bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 mr-2"></span>
                      System
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">
                      <span className="text-xs mr-2">A</span>
                      Small
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="text-sm mr-2">A</span>
                      Medium
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="text-base mr-2">A</span>
                      Large
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Color Accent</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" className="justify-start p-1 h-10">
                      <span className="h-7 w-7 rounded-full bg-blue-500 mr-2"></span>
                      <span className="sr-only">Blue</span>
                    </Button>
                    <Button variant="outline" className="justify-start p-1 h-10">
                      <span className="h-7 w-7 rounded-full bg-green-500 mr-2"></span>
                      <span className="sr-only">Green</span>
                    </Button>
                    <Button variant="outline" className="justify-start p-1 h-10">
                      <span className="h-7 w-7 rounded-full bg-purple-500 mr-2"></span>
                      <span className="sr-only">Purple</span>
                    </Button>
                    <Button variant="outline" className="justify-start p-1 h-10">
                      <span className="h-7 w-7 rounded-full bg-orange-500 mr-2"></span>
                      <span className="sr-only">Orange</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable interface animations</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing in the interface</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
