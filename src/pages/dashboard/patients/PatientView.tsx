import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, AlertTriangle, Activity } from 'lucide-react';
import { patientService } from '@/services/api';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const PatientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await patientService.getPatientById(Number(id));
        console.log("Full API response:", response); // Log entire response

        // Check if response follows { success: true, data: {...} } structure
        const patientData = response.data.data;
        console.log("Extracted patient data:", patientData);

        if (!patientData) {
          throw new Error("No patient data found");
        }

        setPatient(patientData);
        console.log("Set patient state:", patientData);

        if (patientData.VitalSigns) {
          console.log("Vital Signs found:", patientData.VitalSigns);
        } else {
          console.warn("Vital signs data is missing in patientData");
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'bg-red-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(Number(id));
        toast.success('Patient deleted successfully');
        navigate('/dashboard/patients');
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error('Failed to delete patient');
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading patient data...</div>;
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">Patient Not Found</h3>
        <p className="text-muted-foreground mb-4">The requested patient could not be found.</p>
        <Button onClick={() => navigate('/dashboard/patients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard/patients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/patients/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{patient.name}</CardTitle>
            <CardDescription>
              {patient.age} years old • {patient.gender}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Admission Date</span>
              <span>{new Date(patient.admissionDate).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Status</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  patient.status === 'Critical'
                    ? 'bg-red-100 text-red-800'
                    : patient.status === 'Active'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {patient.status}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Sepsis Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-center">{patient.riskScore}%</div>
            <Progress value={patient.riskScore} className={getRiskColor(patient.riskScore)} />
            <div className="text-sm text-muted-foreground text-center mt-2">
              {patient.riskScore >= 75
                ? 'High risk - immediate attention required'
                : patient.riskScore >= 50
                ? 'Moderate risk - close monitoring needed'
                : 'Low risk - continue standard care'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vitals">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-medium mb-4">Current Vital Signs</h3>
          {patient.VitalSigns ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patient.VitalSigns.Temp} °C</div>
                  <p className="text-xs text-muted-foreground">
                    {patient.VitalSigns.Temp > 38 ? 'Above normal' : 'Normal range'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Heart Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patient.VitalSigns.HR} bpm</div>
                  <p className="text-xs text-muted-foreground">
                    {patient.VitalSigns.HR > 100 ? 'Elevated' : 'Normal range'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Respiratory Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patient.VitalSigns.Resp} /min</div>
                  <p className="text-xs text-muted-foreground">
                    {patient.VitalSigns.Resp > 20 ? 'Elevated' : 'Normal range'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Blood Pressure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patient.VitalSigns.SBP} mmHg</div>
                  <p className="text-xs text-muted-foreground">
                    {parseInt(patient.VitalSigns.SBP) > 140 ? 'Hypertensive' : 'Normal range'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Oxygen Saturation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patient.VitalSigns.O2Sat}%</div>
                  <p className="text-xs text-muted-foreground">
                    {patient.VitalSigns.O2Sat < 95 ? 'Below normal' : 'Normal range'}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No vital signs available yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="labs" className="p-4 border rounded-md mt-2">
          {patient.LabResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Test Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.testType}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Glucose</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Glucose} mg/dL</div>
                </CardContent>
                
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.risk_level}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">WBC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.WBC}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Platelets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Platelets}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Glucose</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Glucose}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Lactate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Lactate}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bi-Carbonates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.HCO3}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">FiO2</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.FiO2}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">pH</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.pH}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">AST</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.AST}</div>
                </CardContent>
              </Card><Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">BUN</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.BUN}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Alkalinephos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Alkalinephos}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Calcium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Calcium}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Creatinine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Creatinine}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bilirubin Direct</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Bilirubin_direct}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bilirubin Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Bilirubin_total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">HCT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Hct}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Haemoglobin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Hgb}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">PTT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.PTT}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fibrinogen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Fibrinogen}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Potassium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{patient.LabResults.Potassium}</div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No lab results available yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="p-4 border rounded-md mt-2">
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">
              {patient.medicalHistory || 'No medical history available yet.'}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="treatment" className="p-4 border rounded-md mt-2">
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">No treatment plan available yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientView;