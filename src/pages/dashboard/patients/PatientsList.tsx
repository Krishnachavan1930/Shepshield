import React, { useEffect, useState } from 'react';
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
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { patientService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

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
  useEffect(()=>{
    const fetchPatients = async()=>{
      try{
        const response = await patientService.getAllPatients();
        console.log(response);

        setPatients(response.data.data);
      }catch(err){
        console.error("Error fetching patient, error");
        toast.error("Failed to load patients");
      }
    };
    fetchPatients();
  }, []);
  const [patients, setPatients] = useState<Patient[]>([]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || patient.status.toLowerCase() === filters.status;
    const matchesRisk = filters.risk === 'all' || patient.riskLevel.toLowerCase() === filters.risk;
    const matchesDepartment = filters.department === 'all' || 
                             patient.department.toLowerCase().replace(' ', '') === filters.department.replace(' ', '');
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
      toast.success(`Patient ${patientId} deleted`);
    }
  };

  const handleExport = () => {
    try {
      // Initialize PDF in landscape mode
      const doc = new jsPDF('l', 'pt', 'a4');
      
      // Add hospital logo (optional)
      // const imgData = '/logo.png';
      // doc.addImage(imgData, 'PNG', 40, 20, 50, 50);
      
      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(33, 37, 41);
      doc.text('SHEPSHIELD HOSPITAL - PATIENT RECORDS', 40, 60);
      
      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()} | Total Patients: ${patients.length}`, 40, 80);
      
      // Table data
      const headers = [
        ['ID', 'Patient Name', 'Age/Gender', 'Department', 'Risk Level', 'Status', 'Last Updated']
      ];
      
      const data = patients.map(patient => [
        patient.id,
        patient.name,
        `${patient.age}/${patient.gender}`,
        patient.department,
        patient.riskLevel,
        patient.status,
        patient.lastUpdated
      ]);
      
      // Generate table
      autoTable(doc, {
        head: headers,
        body: data,
        startY: 100,
        margin: { top: 100 },
        styles: {
          cellPadding: 6,
          fontSize: 10,
          valign: 'middle',
          halign: 'left'
        },
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 100 },
          2: { cellWidth: 50 },
          3: { cellWidth: 80 },
          4: { cellWidth: 60 },
          5: { cellWidth: 60 },
          6: { cellWidth: 80 }
        },
        didParseCell: (data) => {
          // Color code risk levels
          if (data.column.index === 4 && data.section === 'body') {
            const risk = data.cell.raw;
            data.cell.styles.textColor = 
              risk === 'High' ? [220, 53, 69] :
              risk === 'Medium' ? [255, 193, 7] :
              [25, 135, 84];
          }
          // Color code status
          if (data.column.index === 5 && data.section === 'body') {
            const status = data.cell.raw;
            data.cell.styles.textColor = 
              status === 'Critical' ? [220, 53, 69] :
              status === 'Active' ? [13, 110, 253] :
              [108, 117, 125];
          }
        }
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`, 
          doc.internal.pageSize.width - 60,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          'Confidential - For internal use only', 
          40, 
          doc.internal.pageSize.height - 20
        );
      }
      
      // Save PDF
      const fileName = `Patient_Records_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      
      // Success notification
      toast.success("Export Successful", {
        description: `Patient records exported to ${fileName}`,
        action: {
          label: "Open",
          onClick: () => {
            const pdfUrl = doc.output('bloburl');
            window.open(pdfUrl, '_blank');
          }
        }
      });
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error("Export Failed", {
        description: error instanceof Error ? error.message : "Failed to generate PDF"
      });
    }
  };

  const getRiskVariant = (risk: string) => 
    risk === 'High' ? 'destructive' : 
    risk === 'Medium' ? 'warning' : 
    'success';

  const getStatusVariant = (status: string) => 
    status === 'Active' ? 'default' : 
    status === 'Discharged' ? 'secondary' : 
    'destructive';

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
          <Button 
            className="flex-1 lg:flex-none" 
            onClick={handleExport}
            disabled={patients.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>
            Showing {filteredPatients.length} of {patients.length} patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(value) => {
            if (value === 'all') {
              setFilters({ ...filters, status: 'all', risk: 'all' });
            } else if (value === 'high') {
              setFilters({ ...filters, risk: 'high' });
            } else if (value === 'active') {
              setFilters({ ...filters, status: 'active' });
            } else if (value === 'discharged') {
              setFilters({ ...filters, status: 'discharged' });
            }
          }}>
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
                options={['all', 'emergency', 'icu', 'generalmedicine', 'cardiology', 'neurology', 'oncology', 'orthopedics', 'pediatrics']} 
                onChange={(value) => setFilters({...filters, department: value})} 
              />
            </div>
            
            <TabsContent value="all">
              <div className="rounded-md border">
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
                        <React.Fragment key={patient.id}>
                          <TableRow>
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
                            <TableCell>{patient.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => toggleRow(patient.id)}
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDelete(patient.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRows.includes(patient.id) && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-gray-50 p-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <p className="text-sm">
                                      <span className="font-medium">Patient ID:</span> {patient.id}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Full Name:</span> {patient.name}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Age/Gender:</span> {patient.age}/{patient.gender}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm">
                                      <span className="font-medium">Department:</span> {patient.department}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Risk Level:</span> {patient.riskLevel}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Status:</span> {patient.status}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32">
                          No patients found matching current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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
    <Select value={value} onValueChange={(newValue) => onChange(newValue)}>
      <SelectTrigger className="h-8 w-[130px]">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>
            {option === 'all' ? 'All' : 
             option === 'generalmedicine' ? 'General Medicine' :
             option.charAt(0).toUpperCase() + option.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default PatientsList;