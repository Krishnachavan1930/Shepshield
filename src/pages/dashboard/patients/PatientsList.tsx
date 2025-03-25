
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Plus, Filter, Eye, FileEdit, Trash2, Download, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  department: string;
  lastUpdated: string;
  status: 'Active' | 'Discharged' | 'Critical';
}

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Filter patients based on search term and filters
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;
    const matchesDepartment = departmentFilter === 'all' || patient.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesRisk && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground">View and manage patient records</p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <Button asChild variant="outline" className="flex-1 lg:flex-none">
            <Link to="/dashboard/patients/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Link>
          </Button>
          <Button className="flex-1 lg:flex-none">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <AnimatedSection animation="fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>
              A total of {patients.length} patients, with {patients.filter(p => p.riskLevel === 'High').length} high risk cases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Patients</TabsTrigger>
                  <TabsTrigger value="high">High Risk</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="discharged">Discharged</TabsTrigger>
                </TabsList>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Status:</p>
                  <Select defaultValue="all" onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Discharged">Discharged</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Risk Level:</p>
                  <Select defaultValue="all" onValueChange={setRiskFilter}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Department:</p>
                  <Select defaultValue="all" onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="all" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map(patient => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.age}/{patient.gender}</TableCell>
                          <TableCell>{patient.department}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskVariant(patient.riskLevel)}>
                              {patient.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(patient.status)}>
                              {patient.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{patient.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32">
                          No patients found matching the current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="high" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients
                      .filter(patient => patient.riskLevel === 'High')
                      .map(patient => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.age}/{patient.gender}</TableCell>
                          <TableCell>{patient.department}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(patient.status)}>
                              {patient.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{patient.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="active" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients
                      .filter(patient => patient.status === 'Active')
                      .map(patient => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.age}/{patient.gender}</TableCell>
                          <TableCell>{patient.department}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskVariant(patient.riskLevel)}>
                              {patient.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{patient.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="discharged" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients
                      .filter(patient => patient.status === 'Discharged')
                      .map(patient => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.age}/{patient.gender}</TableCell>
                          <TableCell>{patient.department}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskVariant(patient.riskLevel)}>
                              {patient.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{patient.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-0">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> patients
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </AnimatedSection>
    </div>
  );
};

// Helper functions
const getRiskVariant = (risk: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (risk) {
    case 'High': return 'destructive';
    case 'Medium': return 'default';
    case 'Low': return 'secondary';
    default: return 'outline';
  }
};

const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case 'Active': return 'default';
    case 'Discharged': return 'secondary';
    case 'Critical': return 'destructive';
    default: return 'outline';
  }
};

// Sample data
const patients: Patient[] = [
  { id: 'P-1234', name: 'Emily Johnson', age: 65, gender: 'F', riskLevel: 'High', department: 'Emergency', lastUpdated: '10 mins ago', status: 'Active' },
  { id: 'P-2345', name: 'Robert Smith', age: 58, gender: 'M', riskLevel: 'Medium', department: 'ICU', lastUpdated: '25 mins ago', status: 'Critical' },
  { id: 'P-3456', name: 'Maria Garcia', age: 42, gender: 'F', riskLevel: 'Low', department: 'General Medicine', lastUpdated: '1 hour ago', status: 'Active' },
  { id: 'P-4567', name: 'James Wilson', age: 72, gender: 'M', riskLevel: 'High', department: 'Cardiology', lastUpdated: '2 hours ago', status: 'Active' },
  { id: 'P-5678', name: 'Linda Chen', age: 49, gender: 'F', riskLevel: 'Medium', department: 'Emergency', lastUpdated: '3 hours ago', status: 'Active' },
  { id: 'P-6789', name: 'Michael Brown', age: 62, gender: 'M', riskLevel: 'Low', department: 'Neurology', lastUpdated: '4 hours ago', status: 'Discharged' },
  { id: 'P-7890', name: 'Sarah Davis', age: 35, gender: 'F', riskLevel: 'Low', department: 'General Medicine', lastUpdated: '5 hours ago', status: 'Discharged' },
  { id: 'P-8901', name: 'Thomas Martinez', age: 68, gender: 'M', riskLevel: 'High', department: 'ICU', lastUpdated: '6 hours ago', status: 'Critical' },
  { id: 'P-9012', name: 'Jessica Lewis', age: 51, gender: 'F', riskLevel: 'Medium', department: 'Cardiology', lastUpdated: '7 hours ago', status: 'Active' },
  { id: 'P-0123', name: 'David Lee', age: 44, gender: 'M', riskLevel: 'Low', department: 'General Medicine', lastUpdated: '8 hours ago', status: 'Discharged' },
  { id: 'P-1345', name: 'Amanda White', age: 77, gender: 'F', riskLevel: 'High', department: 'Emergency', lastUpdated: '9 hours ago', status: 'Active' },
  { id: 'P-2456', name: 'John Clark', age: 55, gender: 'M', riskLevel: 'Medium', department: 'Neurology', lastUpdated: '10 hours ago', status: 'Active' },
];

export default PatientsList;
