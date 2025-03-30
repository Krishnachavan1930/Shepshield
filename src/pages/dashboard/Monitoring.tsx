import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Bell, Search, Filter, RefreshCw, Download, ChevronDown, ExternalLink, 
  Thermometer, HeartPulse, Activity, Gauge, AlertCircle, Clock, ClipboardList,
  TrendingUp, Droplets, Syringe, Pill, CalendarClock, User, ShieldAlert
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

// Mock data with expanded dataset
const generatePatientData = () => {
  const basePatients = [
    { id: 1, name: 'John Smith', age: 68, gender: 'M', status: 'Critical', riskScore: 87, department: 'ICU', lastUpdated: '2 mins ago', admissionDate: '2023-11-10', comorbidities: ['Hypertension', 'Diabetes'] },
    { id: 2, name: 'Sarah Johnson', age: 45, gender: 'F', status: 'At Risk', riskScore: 68, department: 'Emergency', lastUpdated: '5 mins ago', admissionDate: '2023-11-12', comorbidities: ['Asthma'] },
    { id: 3, name: 'Michael Brown', age: 72, gender: 'M', status: 'Stable', riskScore: 35, department: 'General', lastUpdated: '10 mins ago', admissionDate: '2023-11-14', comorbidities: ['COPD', 'CHF'] },
    { id: 4, name: 'Emma Wilson', age: 56, gender: 'F', status: 'At Risk', riskScore: 72, department: 'ICU', lastUpdated: '15 mins ago', admissionDate: '2023-11-11', comorbidities: ['Diabetes'] },
    { id: 5, name: 'David Thompson', age: 39, gender: 'M', status: 'Stable', riskScore: 28, department: 'Emergency', lastUpdated: '18 mins ago', admissionDate: '2023-11-15', comorbidities: [] },
    { id: 6, name: 'Jessica Martinez', age: 62, gender: 'F', status: 'Critical', riskScore: 91, department: 'ICU', lastUpdated: '20 mins ago', admissionDate: '2023-11-09', comorbidities: ['Hypertension', 'Diabetes', 'CKD'] },
  ];

  return basePatients.map(patient => ({
    ...patient,
    vitals: {
      temperature: 36.5 + Math.random() * 3.5,
      heartRate: 70 + Math.floor(Math.random() * 60),
      respRate: 12 + Math.floor(Math.random() * 20),
      bloodPressure: `${100 + Math.floor(Math.random() * 40)}/${60 + Math.floor(Math.random() * 20)}`,
      oxygenSat: 90 + Math.floor(Math.random() * 10),
      lactate: 1.0 + Math.random() * 4.0
    },
    labs: {
      wbc: 5 + Math.floor(Math.random() * 20),
      crp: 10 + Math.floor(Math.random() * 90),
      creatinine: 0.7 + Math.random() * 2.5,
      bilirubin: 0.3 + Math.random() * 3.0,
      platelets: 100 + Math.floor(Math.random() * 300)
    }
  }));
};

// Generate dynamic chart data
const generateChartData = (patientId) => {
  const baseData = [
    { time: '00:00', temperature: 38.2, heartRate: 92, respRate: 19, bloodPressure: '110/70', oxygenSat: 96 },
    { time: '04:00', temperature: 38.4, heartRate: 96, respRate: 20, bloodPressure: '108/68', oxygenSat: 95 },
    { time: '08:00', temperature: 38.7, heartRate: 102, respRate: 22, bloodPressure: '105/65', oxygenSat: 94 },
    { time: '12:00', temperature: 39.0, heartRate: 108, respRate: 24, bloodPressure: '98/60', oxygenSat: 92 },
    { time: '16:00', temperature: 39.2, heartRate: 112, respRate: 25, bloodPressure: '95/58', oxygenSat: 90 },
    { time: '20:00', temperature: 38.9, heartRate: 106, respRate: 23, bloodPressure: '100/62', oxygenSat: 91 },
    { time: '24:00', temperature: 38.5, heartRate: 98, respRate: 21, bloodPressure: '103/64', oxygenSat: 93 },
  ];

  // Add some variability based on patient ID
  return baseData.map(item => ({
    ...item,
    temperature: item.temperature + (patientId % 3) * 0.2,
    heartRate: item.heartRate + (patientId % 5) * 2,
    respRate: item.respRate + (patientId % 4)
  }));
};

const generatePatientProgress = (patientId) => {
  const baseProgress = [
    { date: 'Day 1', sofa: 3, qsofa: 2, risk: 75, lactate: 2.5, antibiotics: 'Started' },
    { date: 'Day 2', sofa: 4, qsofa: 2, risk: 82, lactate: 3.1, antibiotics: 'Continued' },
    { date: 'Day 3', sofa: 5, qsofa: 3, risk: 90, lactate: 4.2, antibiotics: 'Adjusted' },
    { date: 'Day 4', sofa: 4, qsofa: 2, risk: 85, lactate: 3.8, antibiotics: 'Continued' },
    { date: 'Day 5', sofa: 3, qsofa: 2, risk: 78, lactate: 2.9, antibiotics: 'Continued' },
    { date: 'Day 6', sofa: 2, qsofa: 1, risk: 65, lactate: 1.8, antibiotics: 'De-escalated' },
    { date: 'Day 7', sofa: 1, qsofa: 1, risk: 45, lactate: 1.2, antibiotics: 'Oral switch' },
  ];

  // Add variability based on patient ID
  return baseProgress.map(item => ({
    ...item,
    sofa: Math.min(6, item.sofa + (patientId % 3)),
    risk: Math.min(95, item.risk + (patientId % 5) * 2),
    lactate: item.lactate + (patientId % 10) * 0.1
  }));
};

const Monitoring = () => {
  const [patients, setPatients] = useState(generatePatientData());
  const [selectedPatient, setSelectedPatient] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;
    
    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => {
          const randomChange = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0;
          const newRiskScore = Math.max(5, Math.min(95, patient.riskScore + randomChange));
          
          return {
            ...patient,
            riskScore: newRiskScore,
            status: newRiskScore >= 80 ? 'Critical' : newRiskScore >= 60 ? 'At Risk' : 'Stable',
            lastUpdated: 'Just now',
            vitals: {
              ...patient.vitals,
              temperature: 36.5 + Math.random() * 3.5,
              heartRate: 70 + Math.floor(Math.random() * 60),
              respRate: 12 + Math.floor(Math.random() * 20),
              bloodPressure: `${100 + Math.floor(Math.random() * 40)}/${60 + Math.floor(Math.random() * 20)}`,
              oxygenSat: 90 + Math.floor(Math.random() * 10)
            }
          };
        })
      );
      setLastUpdated(new Date());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isRealTime]);
  
  const filteredPatients = patients.filter(patient => {
    return (
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterDepartment === 'all' || patient.department === filterDepartment)
    );
  });
  
  const patientDetails = selectedPatient 
    ? patients.find(p => p.id === selectedPatient) 
    : null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical':
        return <Badge variant="destructive" className="font-medium flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {status}
        </Badge>;
      case 'At Risk':
        return <Badge variant="warning" className="bg-yellow-500 text-white font-medium flex items-center gap-1">
          <ShieldAlert className="h-3 w-3" /> {status}
        </Badge>;
      case 'Stable':
        return <Badge variant="outline" className="bg-green-100 text-green-800 font-medium flex items-center gap-1">
          <Gauge className="h-3 w-3" /> {status}
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getRiskBadge = (score) => {
    if (score >= 80) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> {score}%
      </Badge>;
    } else if (score >= 60) {
      return <Badge variant="warning" className="bg-yellow-500 text-white flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> {score}%
      </Badge>;
    } else if (score >= 40) {
      return <Badge variant="secondary" className="bg-orange-400 text-white flex items-center gap-1">
        {score}%
      </Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
        {score}%
      </Badge>;
    }
  };

  const generateFullReport = (patient) => {
    if (!patient) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm'
    });
    
    // Add watermark
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text('CONFIDENTIAL', 105, 150, { align: 'center', angle: 45 });
    
    // Reset text properties
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SEPSIS MONITORING REPORT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 25, { align: 'center' });
    doc.text(`Hospital: Shepshield Medical Center`, 105, 30, { align: 'center' });

    // Patient Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT INFORMATION', 15, 45);
    
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: 50,
      head: [['ID', 'Name', 'Age/Gender', 'Department', 'Status', 'Risk Score']],
      body: [[
        patient.id,
        patient.name,
        `${patient.age}/${patient.gender}`,
        patient.department,
        patient.status,
        `${patient.riskScore}%`
      ]],
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 }
      }
    });

    // Vital Signs
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VITAL SIGNS', 15, 80);
    
    autoTable(doc, {
      startY: 85,
      head: [['Parameter', 'Value', 'Status']],
      body: [
        ['Temperature', `${patient.vitals.temperature.toFixed(1)}°C`, patient.vitals.temperature > 38 ? 'Elevated' : 'Normal'],
        ['Heart Rate', `${patient.vitals.heartRate} bpm`, patient.vitals.heartRate > 100 ? 'Tachycardia' : 'Normal'],
        ['Resp. Rate', `${patient.vitals.respRate} /min`, patient.vitals.respRate > 20 ? 'Tachypnea' : 'Normal'],
        ['Blood Pressure', patient.vitals.bloodPressure, patient.vitals.bloodPressure.split('/')[0] < 90 ? 'Hypotension' : 'Normal'],
        ['Oxygen Sat', `${patient.vitals.oxygenSat}%`, patient.vitals.oxygenSat < 92 ? 'Hypoxic' : 'Normal'],
        ['Lactate', `${patient.vitals.lactate.toFixed(1)} mmol/L`, patient.vitals.lactate > 2 ? 'Elevated' : 'Normal']
      ],
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 }
      }
    });

    // Laboratory Results
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LABORATORY RESULTS', 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Test', 'Value', 'Reference Range']],
      body: [
        ['WBC', `${patient.labs.wbc} x10³/μL`, '4-11'],
        ['CRP', `${patient.labs.crp} mg/L`, '<10'],
        ['Creatinine', `${patient.labs.creatinine.toFixed(1)} mg/dL`, '0.6-1.2'],
        ['Bilirubin', `${patient.labs.bilirubin.toFixed(1)} mg/dL`, '0.1-1.2'],
        ['Platelets', `${patient.labs.platelets} x10³/μL`, '150-450']
      ]
    });

    // Sepsis Progression
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SEPSIS PROGRESSION', 15, doc.lastAutoTable.finalY + 15);
    
    const progressData = generatePatientProgress(patient.id);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Day', 'SOFA', 'qSOFA', 'Risk', 'Lactate', 'Antibiotics']],
      body: progressData.map(day => [
        day.date,
        day.sofa,
        day.qsofa,
        `${day.risk}%`,
        `${day.lactate.toFixed(1)} mmol/L`,
        day.antibiotics
      ])
    });

    // Current Treatment
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CURRENT TREATMENT', 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Category', 'Details']],
      body: [
        ['Antibiotics', 'Meropenem 1g IV q8h'],
        ['Fluids', 'Lactated Ringer\'s 1L over 30 min, then continuous'],
        ['Vasopressors', 'Norepinephrine 0.05 mcg/kg/min'],
        ['Other Meds', 'Hydrocortisone 50mg IV q6h'],
        ['Interventions', 'Central line placement, Arterial line monitoring']
      ],
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 60 }
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Confidential - For medical use only', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text(`Page ${doc.getNumberOfPages()}`, 195, doc.internal.pageSize.height - 10, { align: 'right' });

    // Save the PDF
    const fileName = `Sepsis_Report_${patient.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    // Notification
    toast.success("Report Generated", {
      description: `Downloaded ${fileName}`,
      action: {
        label: "Open",
        onClick: () => {
          const pdfUrl = doc.output('bloburl');
          window.open(pdfUrl, '_blank');
        }
      }
    });
  };

  const refreshData = () => {
    setPatients(generatePatientData());
    setLastUpdated(new Date());
    toast.success("Data refreshed");
  };

  const toggleRealTime = () => {
    setIsRealTime(!isRealTime);
    toast.info(isRealTime ? "Real-time updates disabled" : "Real-time updates enabled");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sepsis Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time patient monitoring and vital signs analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={isRealTime ? "default" : "outline"}
            onClick={toggleRealTime}
          >
            <Activity className="mr-2 h-4 w-4" />
            {isRealTime ? "Live" : "Static"}
          </Button>
          <Button size="sm" variant="outline" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Updated {lastUpdated.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" /> Critical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {patients.filter(p => p.status === 'Critical').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(patients.filter(p => p.status === 'Critical').length / patients.length * 100)}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-yellow-500" /> At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {patients.filter(p => p.status === 'At Risk').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg risk score: {Math.round(patients.filter(p => p.status === 'At Risk').reduce((acc, p) => acc + p.riskScore, 0) / patients.filter(p => p.status === 'At Risk').length || 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gauge className="h-4 w-4 text-green-500" /> Stable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {patients.filter(p => p.status === 'Stable').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg stay: {Math.floor(Math.random() * 3) + 2} days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Patient List */}
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
                      <div className="col-span-5 sm:col-span-4 font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {patient.name}
                      </div>
                      <div className="col-span-3 sm:col-span-2 text-center">{getStatusBadge(patient.status)}</div>
                      <div className="col-span-4 sm:col-span-2 text-center">{getRiskBadge(patient.riskScore)}</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">{patient.department}</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" /> {patient.lastUpdated}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No patients match your search criteria
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground text-right flex justify-between items-center">
              <span>Showing {filteredPatients.length} of {patients.length} patients</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Alerts Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Recent sepsis alerts and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <Bell className="h-4 w-4" />
                <AlertTitle className="font-medium text-destructive">Critical Alert</AlertTitle>
                <AlertDescription className="text-destructive/90">
                  Jessica Martinez showing signs of severe sepsis. Immediate attention required.
                </AlertDescription>
                <div className="mt-2 text-xs text-destructive/70 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> 5 minutes ago
                </div>
              </Alert>
              
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <Bell className="h-4 w-4" />
                <AlertTitle className="font-medium text-destructive">Critical Alert</AlertTitle>
                <AlertDescription className="text-destructive/90">
                  John Smith vitals deteriorating over the past hour. Intervention needed.
                </AlertDescription>
                <div className="mt-2 text-xs text-destructive/70 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> 12 minutes ago
                </div>
              </Alert>
              
              <Alert className="border-yellow-500/30 bg-yellow-500/10">
                <Bell className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="font-medium text-yellow-600">Warning Alert</AlertTitle>
                <AlertDescription className="text-yellow-600/90">
                  Emma Wilson showing early signs of sepsis. Continue monitoring.
                </AlertDescription>
                <div className="mt-2 text-xs text-yellow-600/70 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> 25 minutes ago
                </div>
              </Alert>
              
              <Alert className="border-yellow-500/30 bg-yellow-500/10">
                <Bell className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="font-medium text-yellow-600">Warning Alert</AlertTitle>
                <AlertDescription className="text-yellow-600/90">
                  Sarah Johnson white blood cell count elevated. Check vital signs.
                </AlertDescription>
                <div className="mt-2 text-xs text-yellow-600/70 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> 42 minutes ago
                </div>
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
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Detail: {patientDetails.name}
                  <Badge variant="outline" className="text-sm font-normal">
                    ID: {patientDetails.id}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>Age: {patientDetails.age} | Gender: {patientDetails.gender}</span>
                  <span>Admitted: {patientDetails.admissionDate}</span>
                  <span>Comorbidities: {patientDetails.comorbidities.join(', ') || 'None'}</span>
                </CardDescription>
              </div>
              <div className="flex mt-2 sm:mt-0 gap-2">
                <Button size="sm" variant="outline" className="gap-1">
                  <ClipboardList className="h-4 w-4" /> Records
                </Button>
                <Button 
                  size="sm"
                  onClick={() => generateFullReport(patientDetails)}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" /> Full Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vitals" className="space-y-4">
              <TabsList className="grid grid-cols-1 sm:grid-cols-4 h-auto">
                <TabsTrigger value="vitals" className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4" /> Vitals
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> Progression
                </TabsTrigger>
                <TabsTrigger value="labs" className="flex items-center gap-1">
                  <Droplets className="h-4 w-4" /> Labs
                </TabsTrigger>
                <TabsTrigger value="treatment" className="flex items-center gap-1">
                  <Syringe className="h-4 w-4" /> Treatment
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Thermometer className="h-4 w-4" /> Temperature
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{patientDetails.vitals.temperature.toFixed(1)}°C</div>
                      <p className={`text-xs ${patientDetails.vitals.temperature > 38 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {patientDetails.vitals.temperature > 38 ? 'Elevated (+1.2)' : 'Normal range'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" /> Heart Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{patientDetails.vitals.heartRate} bpm</div>
                      <p className={`text-xs ${patientDetails.vitals.heartRate > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {patientDetails.vitals.heartRate > 100 ? 'Tachycardia (+32)' : 'Normal range'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" /> Respiratory Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{patientDetails.vitals.respRate} /min</div>
                      <p className={`text-xs ${patientDetails.vitals.respRate > 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {patientDetails.vitals.respRate > 20 ? 'Elevated (+13)' : 'Normal range'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Gauge className="h-4 w-4" /> Blood Pressure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{patientDetails.vitals.bloodPressure} mmHg</div>
                      <p className={`text-xs ${parseInt(patientDetails.vitals.bloodPressure.split('/')[0]) < 90 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {parseInt(patientDetails.vitals.bloodPressure.split('/')[0]) < 90 ? 'Hypotension (-15)' : 'Normal range'}
                      </p>
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
                        <AreaChart data={generateChartData(patientDetails.id)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                          <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                          <Tooltip />
                          <Legend />
                          <Area yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" fill="#fee2e2" name="Temperature (°C)" />
                          <Area yAxisId="right" type="monotone" dataKey="heartRate" stroke="#3b82f6" fill="#dbeafe" name="Heart Rate (bpm)" />
                          <Area yAxisId="right" type="monotone" dataKey="respRate" stroke="#10b981" fill="#d1fae5" name="Resp. Rate (/min)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Sepsis Risk Score Progression</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generatePatientProgress(patientDetails.id)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="risk" stroke="#ef4444" name="Risk Score %" strokeWidth={2} />
                            <Line type="monotone" dataKey="lactate" stroke="#6366f1" name="Lactate (mmol/L)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Organ Dysfunction Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={generatePatientProgress(patientDetails.id)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sofa" fill="#6366f1" name="SOFA Score" />
                            <Bar dataKey="qsofa" fill="#0ea5e9" name="qSOFA Score" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Risk Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Critical</div>
                      <p className="text-xs text-destructive">Immediate intervention needed</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span className="font-medium">{patientDetails.riskScore}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Trend:</span>
                          <span className="font-medium text-destructive">+12% (24h)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" /> SOFA Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5 / 24</div>
                      <p className="text-xs text-destructive">Increased organ dysfunction</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Respiratory:</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Coagulation:</span>
                          <span className="font-medium">1</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Liver:</span>
                          <span className="font-medium">1</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4" /> qSOFA Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3 / 3</div>
                      <p className="text-xs text-destructive">High risk for poor outcome</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>RR ≥22:</span>
                          <span className="font-medium">Yes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>SBP ≤100:</span>
                          <span className="font-medium">Yes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>AMS:</span>
                          <span className="font-medium">Yes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="labs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Laboratory Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between pb-2 border-b">
                          <span className="font-medium">WBC Count</span>
                          <span className="font-bold">{patientDetails.labs.wbc} x10³/μL</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span className="font-medium">CRP</span>
                          <span className="font-bold">{patientDetails.labs.crp} mg/L</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span className="font-medium">Creatinine</span>
                          <span className="font-bold">{patientDetails.labs.creatinine.toFixed(1)} mg/dL</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span className="font-medium">Bilirubin</span>
                          <span className="font-bold">{patientDetails.labs.bilirubin.toFixed(1)} mg/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Platelets</span>
                          <span className="font-bold">{patientDetails.labs.platelets} x10³/μL</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Lab Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                            { subject: 'WBC', A: 11, B: patientDetails.labs.wbc, fullMark: 25 },
                            { subject: 'CRP', A: 10, B: patientDetails.labs.crp, fullMark: 100 },
                            { subject: 'Creat', A: 1.2, B: patientDetails.labs.creatinine, fullMark: 3 },
                            { subject: 'Bili', A: 1.2, B: patientDetails.labs.bilirubin, fullMark: 3 },
                            { subject: 'Plt', A: 150, B: patientDetails.labs.platelets, fullMark: 450 },
                          ]}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 10']} />
                            <Tooltip />
                            <Radar name="Normal" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                            <Radar name="Patient" dataKey="B" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="treatment" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" /> Recommended Protocol
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" /> 1. Hour 1 (Sepsis Bundle)
                        </h3>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>Measure lactate level (current: {patientDetails.vitals.lactate.toFixed(1)} mmol/L)</li>
                          <li>Obtain blood cultures before administering antibiotics</li>
                          <li>Administer broad-spectrum antibiotics within 1 hour</li>
                          <li>Begin rapid administration of crystalloid (30 ml/kg) for hypotension or lactate ≥4 mmol/L</li>
                          <li>Apply vasopressors for hypotension during/after fluid resuscitation</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4" /> 2. Ongoing Monitoring
                        </h3>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>Reassess volume status and tissue perfusion every 2 hours</li>
                          <li>Document reassessment results including vital signs and SOFA score</li>
                          <li>Re-measure lactate if initial lactate was elevated</li>
                          <li>Monitor urine output with Foley catheter</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <Pill className="h-4 w-4" /> 3. Directed Therapy
                        </h3>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>Source control within the first 6-12 hours</li>
                          <li>Daily reassessment for potential de-escalation of antimicrobial therapy</li>
                          <li>Maintain glucose control with protocol (target 140-180 mg/dL)</li>
                          <li>Consider stress ulcer prophylaxis</li>
                          <li>Consider DVT prophylaxis unless contraindicated</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Syringe className="h-4 w-4" /> Current Treatment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium flex items-center gap-2">
                          <Pill className="h-4 w-4" /> Antibiotics
                        </span>
                        <span>Meropenem 1g IV q8h (started 24h ago)</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium flex items-center gap-2">
                          <Droplets className="h-4 w-4" /> Fluids
                        </span>
                        <span>Lactated Ringer's 1L over 30 min, then continuous</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4" /> Vasopressors
                        </span>
                        <span>Norepinephrine 0.05 mcg/kg/min (titrated to MAP ≥65)</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-medium flex items-center gap-2">
                          <Pill className="h-4 w-4" /> Other Medications
                        </span>
                        <span>Hydrocortisone 50mg IV q6h, Pantoprazole 40mg IV daily</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" /> Interventions
                        </span>
                        <span>Central line placement, Arterial line monitoring, Foley catheter</span>
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