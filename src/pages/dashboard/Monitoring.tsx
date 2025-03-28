
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, Search, Filter, RefreshCw, Download, ChevronDown, ExternalLink } from 'lucide-react';

// Mock data for the monitoring dashboard
const patientVitalsData = [
  { id: 1, name: 'John Smith', status: 'Critical', riskScore: 87, department: 'ICU', lastUpdated: '2 mins ago' },
  { id: 2, name: 'Sarah Johnson', status: 'At Risk', riskScore: 68, department: 'Emergency', lastUpdated: '5 mins ago' },
  { id: 3, name: 'Michael Brown', status: 'Stable', riskScore: 35, department: 'General', lastUpdated: '10 mins ago' },
  { id: 4, name: 'Emma Wilson', status: 'At Risk', riskScore: 72, department: 'ICU', lastUpdated: '15 mins ago' },
  { id: 5, name: 'David Thompson', status: 'Stable', riskScore: 28, department: 'Emergency', lastUpdated: '18 mins ago' },
  { id: 6, name: 'Jessica Martinez', status: 'Critical', riskScore: 91, department: 'ICU', lastUpdated: '20 mins ago' },
];

// Chart data
const chartData = [
  { time: '00:00', temperature: 38.2, heartRate: 92, respRate: 19 },
  { time: '04:00', temperature: 38.4, heartRate: 96, respRate: 20 },
  { time: '08:00', temperature: 38.7, heartRate: 102, respRate: 22 },
  { time: '12:00', temperature: 39.0, heartRate: 108, respRate: 24 },
  { time: '16:00', temperature: 39.2, heartRate: 112, respRate: 25 },
  { time: '20:00', temperature: 38.9, heartRate: 106, respRate: 23 },
  { time: '24:00', temperature: 38.5, heartRate: 98, respRate: 21 },
];

// Patient progress data
const patientProgress = [
  { date: 'Day 1', sofa: 3, qsofa: 2, risk: 75 },
  { date: 'Day 2', sofa: 4, qsofa: 2, risk: 82 },
  { date: 'Day 3', sofa: 5, qsofa: 3, risk: 90 },
  { date: 'Day 4', sofa: 4, qsofa: 2, risk: 85 },
  { date: 'Day 5', sofa: 3, qsofa: 2, risk: 78 },
  { date: 'Day 6', sofa: 2, qsofa: 1, risk: 65 },
  { date: 'Day 7', sofa: 1, qsofa: 1, risk: 45 },
];

const Monitoring = () => {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  
  const filteredPatients = patientVitalsData.filter(patient => {
    return (
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterDepartment === 'all' || patient.department === filterDepartment)
    );
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Critical':
        return <Badge variant="destructive" className="font-medium">{status}</Badge>;
      case 'At Risk':
        return <Badge variant="warning" className="bg-yellow-500 text-white font-medium">{status}</Badge>;
      case 'Stable':
        return <Badge variant="outline" className="bg-green-100 text-green-800 font-medium">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getRiskBadge = (score: number) => {
    if (score >= 80) {
      return <Badge variant="destructive">{score}%</Badge>;
    } else if (score >= 60) {
      return <Badge variant="warning" className="bg-yellow-500 text-white">{score}%</Badge>;
    } else if (score >= 40) {
      return <Badge variant="secondary" className="bg-orange-400 text-white">{score}%</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800">{score}%</Badge>;
    }
  };
  
  const patientDetails = selectedPatient 
    ? patientVitalsData.find(p => p.id === selectedPatient) 
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sepsis Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time patient monitoring and vital signs analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Patients Under Surveillance</CardTitle>
            <CardDescription>Monitoring sepsis risk scores and vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
              <div className="flex w-full sm:w-auto gap-2">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                <Select defaultValue="risk">
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk">Risk Score</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium border-b">
                <div className="col-span-5 sm:col-span-4">Patient</div>
                <div className="col-span-3 sm:col-span-2 text-center">Status</div>
                <div className="col-span-4 sm:col-span-2 text-center">Risk Score</div>
                <div className="hidden sm:block sm:col-span-2 text-center">Department</div>
                <div className="hidden sm:block sm:col-span-2 text-center">Last Updated</div>
              </div>
              
              <div className="divide-y max-h-80 overflow-auto">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div 
                      key={patient.id}
                      className={`grid grid-cols-12 gap-2 p-3 text-sm items-center cursor-pointer hover:bg-muted/50 transition-colors ${selectedPatient === patient.id ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedPatient(patient.id)}
                    >
                      <div className="col-span-5 sm:col-span-4 font-medium">{patient.name}</div>
                      <div className="col-span-3 sm:col-span-2 text-center">{getStatusBadge(patient.status)}</div>
                      <div className="col-span-4 sm:col-span-2 text-center">{getRiskBadge(patient.riskScore)}</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">{patient.department}</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">{patient.lastUpdated}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No patients match your search criteria
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground text-right">
              Total patients: {filteredPatients.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Recent sepsis alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <Bell className="h-4 w-4" />
                <AlertTitle className="font-medium text-destructive">Critical Alert</AlertTitle>
                <AlertDescription className="text-destructive/90">
                  Jessica Martinez showing signs of severe sepsis. Immediate attention required.
                </AlertDescription>
              </Alert>
              
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <Bell className="h-4 w-4" />
                <AlertTitle className="font-medium text-destructive">Critical Alert</AlertTitle>
                <AlertDescription className="text-destructive/90">
                  John Smith vitals deteriorating over the past hour. Intervention needed.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-yellow-500/30 bg-yellow-500/10">
                <Bell className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="font-medium text-yellow-600">Warning Alert</AlertTitle>
                <AlertDescription className="text-yellow-600/90">
                  Emma Wilson showing early signs of sepsis. Continue monitoring.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-yellow-500/30 bg-yellow-500/10">
                <Bell className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="font-medium text-yellow-600">Warning Alert</AlertTitle>
                <AlertDescription className="text-yellow-600/90">
                  Sarah Johnson white blood cell count elevated. Check vital signs.
                </AlertDescription>
              </Alert>
              
              <Button variant="outline" className="w-full justify-between">
                View all alerts <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedPatient && patientDetails && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle>Patient Detail: {patientDetails.name}</CardTitle>
                <CardDescription>Monitoring vital signs and sepsis progression</CardDescription>
              </div>
              <div className="flex mt-2 sm:mt-0 gap-2">
                <Button size="sm" variant="outline">Patient Records</Button>
                <Button size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" /> Full Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vitals" className="space-y-4">
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 h-auto">
                <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                <TabsTrigger value="progress">Sepsis Progression</TabsTrigger>
                <TabsTrigger value="treatment">Treatment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">39.2°C</div>
                      <p className="text-xs text-destructive">Elevated (+1.2)</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">112 bpm</div>
                      <p className="text-xs text-destructive">Tachycardia (+32)</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Respiratory Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">25 /min</div>
                      <p className="text-xs text-destructive">Elevated (+13)</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">95/60 mmHg</div>
                      <p className="text-xs text-destructive">Hypotension (-15)</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Vital Signs Trend (24 hours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis yAxisId="left" orientation="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Area yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" fill="#fee2e2" name="Temperature" />
                          <Area yAxisId="right" type="monotone" dataKey="heartRate" stroke="#3b82f6" fill="#dbeafe" name="Heart Rate" />
                          <Area yAxisId="right" type="monotone" dataKey="respRate" stroke="#10b981" fill="#d1fae5" name="Resp. Rate" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sepsis Risk Score Progression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={patientProgress} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="#fee2e2" name="Risk Score %" />
                          <Area type="monotone" dataKey="sofa" stroke="#6366f1" fill="#e0e7ff" name="SOFA Score" />
                          <Area type="monotone" dataKey="qsofa" stroke="#0ea5e9" fill="#e0f2fe" name="qSOFA Score" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Risk Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Critical</div>
                      <p className="text-xs text-destructive">Immediate intervention needed</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">SOFA Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5 / 24</div>
                      <p className="text-xs text-destructive">Increased organ dysfunction</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">qSOFA Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3 / 3</div>
                      <p className="text-xs text-destructive">High risk for poor outcome</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="treatment" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Recommended Protocol</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">1. Hour 1 (Sepsis Bundle)</h3>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          <li>Measure lactate level</li>
                          <li>Obtain blood cultures before administering antibiotics</li>
                          <li>Administer broad-spectrum antibiotics</li>
                          <li>Begin rapid administration of crystalloid (30 ml/kg) for hypotension or lactate ≥4 mmol/L</li>
                          <li>Apply vasopressors for hypotension during/after fluid resuscitation</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">2. Ongoing Monitoring</h3>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          <li>Reassess volume status and tissue perfusion</li>
                          <li>Document reassessment results</li>
                          <li>Re-measure lactate if initial lactate was elevated</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">3. Directed Therapy</h3>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          <li>Source control within the first 6-12 hours</li>
                          <li>Daily reassessment for potential de-escalation of antimicrobial therapy</li>
                          <li>Maintain glucose control with protocol</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Treatment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium">Antibiotics</span>
                        <span>Meropenem 1g IV q8h</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium">Fluids</span>
                        <span>Lactated Ringer's 1L over 30 min, then continuous</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium">Vasopressors</span>
                        <span>Norepinephrine 0.05 mcg/kg/min</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium">Other Medications</span>
                        <span>Hydrocortisone 50mg IV q6h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Interventions</span>
                        <span>Central line placement, Arterial line monitoring</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Monitoring;
