import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Plus, FileEdit, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
  const [filters, setFilters] = useState({
    status: 'all',
    risk: 'all',
    department: 'all'
  });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const [patients] = useState<Patient[]>([
    { id: 'P-1001', name: 'Emily Johnson', age: 65, gender: 'F', riskLevel: 'High', department: 'Cardiology', lastUpdated: '10 mins ago', status: 'Active' },
    { id: 'P-1002', name: 'Robert Smith', age: 58, gender: 'M', riskLevel: 'Medium', department: 'Neurology', lastUpdated: '25 mins ago', status: 'Critical' },
    { id: 'P-1003', name: 'Maria Garcia', age: 42, gender: 'F', riskLevel: 'Low', department: 'General Medicine', lastUpdated: '1 hour ago', status: 'Active' },
    { id: 'P-1004', name: 'James Wilson', age: 72, gender: 'M', riskLevel: 'High', department: 'Emergency', lastUpdated: '2 hours ago', status: 'Active' },
    { id: 'P-1005', name: 'Linda Chen', age: 49, gender: 'F', riskLevel: 'Medium', department: 'Oncology', lastUpdated: '3 hours ago', status: 'Active' },
    { id: 'P-1006', name: 'Michael Brown', age: 62, gender: 'M', riskLevel: 'Low', department: 'Orthopedics', lastUpdated: '4 hours ago', status: 'Discharged' },
    { id: 'P-1007', name: 'Sarah Davis', age: 35, gender: 'F', riskLevel: 'Low', department: 'Pediatrics', lastUpdated: '5 hours ago', status: 'Discharged' },
    { id: 'P-1008', name: 'Thomas Martinez', age: 68, gender: 'M', riskLevel: 'High', department: 'ICU', lastUpdated: '6 hours ago', status: 'Critical' },
    { id: 'P-1009', name: 'Jessica Lewis', age: 51, gender: 'F', riskLevel: 'Medium', department: 'Cardiology', lastUpdated: '7 hours ago', status: 'Active' },
    { id: 'P-1010', name: 'David Lee', age: 44, gender: 'M', riskLevel: 'Low', department: 'General Medicine', lastUpdated: '8 hours ago', status: 'Discharged' },
    { id: 'P-1011', name: 'Amanda White', age: 77, gender: 'F', riskLevel: 'High', department: 'Emergency', lastUpdated: '9 hours ago', status: 'Active' },
    { id: 'P-1012', name: 'John Clark', age: 55, gender: 'M', riskLevel: 'Medium', department: 'Neurology', lastUpdated: '10 hours ago', status: 'Active' },
    { id: 'P-1013', name: 'Jennifer Hall', age: 39, gender: 'F', riskLevel: 'Low', department: 'Pediatrics', lastUpdated: '11 hours ago', status: 'Active' },
    { id: 'P-1014', name: 'Daniel Young', age: 60, gender: 'M', riskLevel: 'Medium', department: 'Oncology', lastUpdated: '12 hours ago', status: 'Critical' },
    { id: 'P-1015', name: 'Sophia Allen', age: 47, gender: 'F', riskLevel: 'Low', department: 'Orthopedics', lastUpdated: '13 hours ago', status: 'Discharged' }
  ]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || patient.status.toLowerCase() === filters.status;
    const matchesRisk = filters.risk === 'all' || patient.riskLevel.toLowerCase() === filters.risk;
    const matchesDepartment = filters.department === 'all' || 
                             patient.department.toLowerCase() === filters.department;
    return matchesSearch && matchesStatus && matchesRisk && matchesDepartment;
  });

  const toggleRow = (patientId: string) => {
    setExpandedRows(prev => 
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };
  
  const handleDelete = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(prev => prev.filter(p => p.id !== patientId));
      setExpandedRows(prev => prev.filter(id => id !== patientId));
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('Patient Records - Shepshield Hospital', 14, 22);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Patients: ${patients.length}`, 14, 30);
    
    // Table data
    const tableData = patients.map(patient => [
      patient.id,
      patient.name,
      `${patient.age}/${patient.gender}`,
      patient.department,
      patient.riskLevel,
      patient.status,
      patient.lastUpdated
    ]);
    
    // AutoTable
    (doc as any).autoTable({
      head: [
        ['ID', 'Name', 'Age/Gender', 'Department', 'Risk', 'Status', 'Last Updated']
      ],
      body: tableData,
      startY: 40,
      styles: {
        cellPadding: 3,
        fontSize: 9,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 30 },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 15 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 }
      },
      didDrawCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 4) {
          const risk = data.cell.raw;
          doc.setTextColor(
            risk === 'High' ? 231 : 
            risk === 'Medium' ? 0 : 
            0
          );
        }
      }
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Confidential - Shepshield Hospital Patient Records', 14, finalY);
    
    // Save PDF
    doc.save(`Shepshield_Patients_${new Date().toISOString().slice(0, 10)}.pdf`);
    
    // Notification
    toast.success("Patient records exported", {
      description: "PDF download has started",
      action: {
        label: "Open",
        onClick: () => window.open(doc.output('bloburl'), '_blank')
      }
    });
  };

  const renderPatientRow = (patient: Patient) => (
    <React.Fragment key={patient.id}>
      <TableRow>
        <TableCell>{patient.id}</TableCell>
        <TableCell>{patient.name}</TableCell>
        <TableCell>{patient.age}/{patient.gender}</TableCell>
        <TableCell>{patient.department}</TableCell>
        <TableCell><Badge variant={getRiskVariant(patient.riskLevel)}>{patient.riskLevel}</Badge></TableCell>
        <TableCell><Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge></TableCell>
        <TableCell>{patient.lastUpdated}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => toggleRow(patient.id)}>
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expandedRows.includes(patient.id) && (
        <TableRow>
          <TableCell colSpan={8} className="bg-gray-50">
            <div className="p-4">
              <h4 className="text-sm font-medium">Patient Details</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm"><strong>ID:</strong> {patient.id}</p>
                  <p className="text-sm"><strong>Name:</strong> {patient.name}</p>
                  <p className="text-sm"><strong>Age/Gender:</strong> {patient.age}/{patient.gender}</p>
                </div>
                <div>
                  <p className="text-sm"><strong>Department:</strong> {patient.department}</p>
                  <p className="text-sm"><strong>Risk Level:</strong> {patient.riskLevel}</p>
                  <p className="text-sm"><strong>Status:</strong> {patient.status}</p>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );

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
          <Button className="flex-1 lg:flex-none" onClick={handleExport}>
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
              Showing {filteredPatients.length} of {patients.length} patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
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
                <FilterSelect 
                  label="Status" 
                  value={filters.status} 
                  options={['all', 'active', 'discharged', 'critical']} 
                  onChange={(value) => setFilters({...filters, status: value})} 
                />
                <FilterSelect 
                  label="Risk Level" 
                  value={filters.risk} 
                  options={['all', 'high', 'medium', 'low']} 
                  onChange={(value) => setFilters({...filters, risk: value})} 
                />
                <FilterSelect 
                  label="Department" 
                  value={filters.department} 
                  options={['all', 'emergency', 'icu', 'general medicine', 'cardiology', 'neurology', 'oncology', 'orthopedics', 'pediatrics']} 
                  onChange={(value) => setFilters({...filters, department: value})} 
                />
              </div>
              
              <TabsContent value="all">
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
                      filteredPatients.map(renderPatientRow)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32">
                          No patients found matching current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-0">
            <div className="text-sm text-muted-foreground">
              {filteredPatients.length} patients displayed
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

const FilterSelect = ({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: string[]; 
  onChange: (value: string) => void 
}) => (
  <div className="flex items-center space-x-2">
    <p className="text-sm font-medium">{label}:</p>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[130px]">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>
            {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const getRiskVariant = (risk: string) => 
  risk === 'High' ? 'destructive' : risk === 'Medium' ? 'default' : 'secondary';

const getStatusVariant = (status: string) => 
  status === 'Active' ? 'default' : status === 'Discharged' ? 'secondary' : 'destructive';

export default PatientsList;