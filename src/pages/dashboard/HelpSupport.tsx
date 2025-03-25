
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, MessageSquare, FileText, Video, HelpCircle, Mail, Send, Book, Play, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSupportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      toast.error('Please enter a message before submitting');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Support request submitted successfully');
      setIsLoading(false);
      setSupportMessage('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Get assistance with using the SepsisCare platform</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search help articles, tutorials, and more..."
          className="pl-10 py-6 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about the SepsisCare platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the sepsis detection algorithm work?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Our sepsis detection algorithm uses machine learning to analyze a combination of vital signs, lab results, and electronic health record data. It looks for subtle patterns and changes that may indicate early sepsis development, often before clinical symptoms appear. The algorithm continuously improves through feedback from medical professionals.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>What data formats can I upload to the system?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      The SepsisCare platform accepts various file formats for data upload, including CSV, Excel (XLSX), PDF, and structured text files. For optimal analysis, we recommend using our standardized templates available in the Reports Upload section. The system can also integrate directly with most hospital EMR systems for automatic data transfer.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How accurate is the risk scoring system?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Our risk scoring system has demonstrated a 93% accuracy rate in clinical trials, with a sensitivity of 95% and specificity of 92%. The system is calibrated to prioritize early detection, which may result in some false positives. However, this approach has been shown to reduce sepsis mortality by detecting cases an average of 6 hours earlier than traditional methods.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I integrate SepsisCare with our existing hospital systems?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Yes, SepsisCare is designed to integrate with most major hospital information systems and EMRs. We provide API access and have built-in connectors for Epic, Cerner, Meditech, and other popular systems. Our integration team can work directly with your IT department to ensure seamless data flow and alerts management.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How are alerts prioritized and delivered?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Alerts are prioritized based on risk score, rate of change in vital signs, and specific biomarkers that indicate severe sepsis. High-priority alerts are delivered through multiple channels including dashboard notifications, email, text messages, and integration with hospital paging systems. Alert channels and escalation protocols can be customized for your facility's workflow.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>What training is required to use the system effectively?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      We offer comprehensive training programs tailored to different user roles. Most clinical staff can become proficient with the basic features after a 1-hour training session. Advanced features like custom analytics and reporting typically require an additional 2-hour session. Our training materials include video tutorials, interactive guides, and live support sessions.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? Contact our support team for assistance.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Comprehensive guides and reference materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Book className="h-5 w-5 mr-2 text-primary" />
                        User Guide
                      </CardTitle>
                      <Badge variant="outline">v3.2</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Complete walkthrough of all SepsisCare features and functions.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Guide</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Administrator Manual
                      </CardTitle>
                      <Badge variant="outline">v3.0</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Setup, configuration, and management of the SepsisCare platform.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Manual</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Clinical Guide
                      </CardTitle>
                      <Badge variant="outline">v3.1</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Clinical interpretation of sepsis scores and recommended interventions.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Guide</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      API Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Complete API documentation for system integration and custom development.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Reference</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Data Dictionary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Detailed descriptions of all data fields and their definitions.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Dictionary</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Release Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Latest features, improvements, and bug fixes in the current version.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Notes</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Resources</CardTitle>
              <CardDescription>
                Learn how to effectively use the SepsisCare platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Video Tutorials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-muted relative rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Getting Started with SepsisCare</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-xs text-muted-foreground">10:25 • Basic introduction to the platform</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Watch</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-muted relative rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Patient Monitoring & Alerts</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-xs text-muted-foreground">12:40 • Managing patient monitoring</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Watch</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-muted relative rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Data Upload & Processing</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-xs text-muted-foreground">8:15 • Working with patient data</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Watch</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Interactive Courses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Sepsis Detection Fundamentals</CardTitle>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Beginner</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Book className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">5 Modules</p>
                            <p className="text-xs text-muted-foreground">Approximately 2 hours</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Learn the basics of sepsis detection and how the SepsisCare platform works.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Start Course</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Advanced Analytics & Reporting</CardTitle>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Intermediate</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Book className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">7 Modules</p>
                            <p className="text-xs text-muted-foreground">Approximately 3.5 hours</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Master the analytics features and learn how to generate custom reports.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Start Course</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Upcoming Webinars</h3>
                  <p className="text-sm text-muted-foreground mb-4">Live training sessions with our clinical experts</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">New Features Overview</h4>
                        <p className="text-sm text-muted-foreground">Oct 25, 2023 • 11:00 AM EST</p>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Advanced Sepsis Monitoring Techniques</h4>
                        <p className="text-sm text-muted-foreground">Nov 2, 2023 • 2:00 PM EST</p>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Integration Best Practices</h4>
                        <p className="text-sm text-muted-foreground">Nov 10, 2023 • 10:00 AM EST</p>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Send a message to our support team for assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSupportRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="issue-type">Issue Type</Label>
                      <select 
                        id="issue-type" 
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account Management</option>
                        <option value="feature">Feature Request</option>
                        <option value="billing">Billing Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select 
                        id="priority" 
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="low">Low - General Question</option>
                        <option value="medium">Medium - Some Functionality Affected</option>
                        <option value="high">High - Critical Functionality Affected</option>
                        <option value="urgent">Urgent - System Unavailable</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Brief description of your issue" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Please provide details about your issue or question..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="attachments">Attachments (Optional)</Label>
                      <Input id="attachments" type="file" multiple />
                      <p className="text-xs text-muted-foreground">
                        You can attach screenshots or files to help us understand your issue better.
                      </p>
                    </div>
                  
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <Send className="mr-2 h-4 w-4" />
                      {isLoading ? 'Sending...' : 'Submit Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@sepsiscare.med</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7 for urgent issues</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Support Hours</p>
                      <p className="text-sm text-muted-foreground">Monday-Friday: 8am-8pm EST</p>
                      <p className="text-sm text-muted-foreground">Weekend: 9am-5pm EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Common Solutions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="font-medium">Trouble Logging In?</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      Try resetting your password or clearing browser cookies.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="font-medium">Data Not Uploading?</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      Check file format and size limits in our documentation.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="font-medium">Missing Alerts?</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      Verify notification settings in your user profile.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="link" className="p-0">
                      View all troubleshooting guides
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupport;
