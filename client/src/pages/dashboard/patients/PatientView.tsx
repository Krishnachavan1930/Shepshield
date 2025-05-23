import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, AlertTriangle, Activity } from "lucide-react";
import { patientService } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const PatientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await patientService.getPatientById(id as string);
        setPatient(response.data.data);
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
    if (score >= 75) return "bg-red-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-green-500";
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await patientService.deletePatient(id as string);
        toast.success("Patient deleted successfully");
        navigate("/dashboard/patients");
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast.error("Failed to delete patient");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">Loading patient data...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">Patient Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The requested patient could not be found.
        </p>
        <Button onClick={() => navigate("/dashboard/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
        </Button>
      </div>
    );
  }

  // Get the current vital signs (most recent one)
  const currentVitals =
    patient.vitalSigns && patient.vitalSigns.length > 0
      ? patient.vitalSigns[patient.vitalSigns.length - 1]
      : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/dashboard/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/patients/edit/${id}`)}
          >
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
              <span>
                {new Date(patient.admissionDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.status === "Critical"
                      ? "bg-red-100 text-red-800"
                      : patient.status === "Active"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {patient.status}
                </span>
              </div>
            </div>
            {patient.department && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium">Department</span>
                <span>{patient.department}</span>
              </div>
            )}
            {patient.medicalRecordNumber && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium">
                  Medical Record Number
                </span>
                <span>{patient.medicalRecordNumber}</span>
              </div>
            )}
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
            <div className="text-4xl font-bold text-center">
              {patient.riskScore}%
            </div>
            <Progress
              value={patient.riskScore}
              className={getRiskColor(patient.riskScore)}
            />
            <div className="text-sm text-muted-foreground text-center mt-2">
              {patient.riskScore >= 75
                ? "High risk - immediate attention required"
                : patient.riskScore >= 50
                ? "Moderate risk - close monitoring needed"
                : "Low risk - continue standard care"}
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
          {currentVitals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentVitals.temperature} °C
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentVitals.temperature > 38
                      ? "Above normal"
                      : "Normal range"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Heart Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentVitals.heartRate} bpm
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentVitals.heartRate > 100
                      ? "Elevated"
                      : "Normal range"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Respiratory Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentVitals.respiratoryRate} /min
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentVitals.respiratoryRate > 20
                      ? "Elevated"
                      : "Normal range"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Blood Pressure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentVitals.bloodPressure} mmHg
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {parseInt(currentVitals.bloodPressure.split("/")[0]) > 140
                      ? "Hypertensive"
                      : "Normal range"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Oxygen Saturation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentVitals.oxygenSaturation}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentVitals.oxygenSaturation < 95
                      ? "Below normal"
                      : "Normal range"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">
                No vital signs available yet.
              </p>
            </div>
          )}

          {patient.vitalSigns && patient.vitalSigns.length > 1 && (
            <div className="mt-8">
              <h4 className="text-md font-medium mb-4">Vital Signs History</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Temp. (°C)</th>
                      <th className="p-2 text-left">Heart Rate (bpm)</th>
                      <th className="p-2 text-left">Resp. Rate (/min)</th>
                      <th className="p-2 text-left">Blood Pressure</th>
                      <th className="p-2 text-left">O2 Sat. (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.vitalSigns
                      .slice()
                      .reverse()
                      .map((vital: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">
                            {new Date(vital.recordedAt).toLocaleString()}
                          </td>
                          <td className="p-2">{vital.temperature}</td>
                          <td className="p-2">{vital.heartRate}</td>
                          <td className="p-2">{vital.respiratoryRate}</td>
                          <td className="p-2">{vital.bloodPressure}</td>
                          <td className="p-2">{vital.oxygenSaturation}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="labs" className="p-4 border rounded-md mt-2">
          {patient.labResults && patient.labResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Test Type</th>
                    <th className="p-2 text-left">Value</th>
                    <th className="p-2 text-left">Unit</th>
                    <th className="p-2 text-left">Normal Range</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.labResults
                    .slice()
                    .reverse()
                    .map((lab: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{lab.testType}</td>
                        <td className="p-2">{lab.value}</td>
                        <td className="p-2">{lab.unit}</td>
                        <td className="p-2">{lab.normalRange}</td>
                        <td className="p-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              lab.isAbnormal
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {lab.isAbnormal ? "Abnormal" : "Normal"}
                          </span>
                        </td>
                        <td className="p-2">
                          {new Date(lab.recordedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">
                No lab results available yet.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="history" className="p-4 border rounded-md mt-2">
          {patient.medicalHistory ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium mb-2">Medical History</h4>
                <p className="whitespace-pre-line">{patient.medicalHistory}</p>
              </div>
              <Separator />
              {patient.allergies && (
                <div>
                  <h4 className="text-md font-medium mb-2">Allergies</h4>
                  <p className="whitespace-pre-line">{patient.allergies}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">
                No medical history available yet.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="treatment" className="p-4 border rounded-md mt-2">
          {patient.medications ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium mb-2">
                  Current Medications
                </h4>
                <p className="whitespace-pre-line">{patient.medications}</p>
              </div>
              <Separator />
              {patient.notes && (
                <div>
                  <h4 className="text-md font-medium mb-2">Treatment Notes</h4>
                  <p className="whitespace-pre-line">{patient.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">
                No treatment plan available yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientView;
