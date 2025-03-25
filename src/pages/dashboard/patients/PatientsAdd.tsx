import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { patientService } from '@/services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { patientSchema, PatientFormValues } from '@/schemas/patientSchema';

const PatientsAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      age: undefined,
      gender: '', // Empty string to show placeholder initially
      admissionDate: new Date().toISOString().split('T')[0],
      department: '', // Empty string to show placeholder initially
      medicalRecordNumber: '',
      temperature: undefined,
      heartRate: undefined,
      respiratoryRate: undefined,
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      oxygenSaturation: undefined,
      medicalHistory: '',
      allergies: '',
      medications: '',
      notes: '',
    },
  });

  // Watch form values and errors for debugging
  const genderValue = form.watch('gender');
  const departmentValue = form.watch('department');
  const formErrors = form.formState.errors;

  console.log('Gender value:', genderValue);
  console.log('Department value:', departmentValue);
  console.log('Form errors:', formErrors);

  const calculateStatus = () => {
    const { temperature, heartRate, respiratoryRate } = form.getValues();

    if (!temperature || !heartRate || !respiratoryRate) return 'Moderate';

    if (
      temperature > 38.5 || 
      heartRate > 100 || 
      respiratoryRate > 22
    ) {
      return 'Severe';
    } else if (
      temperature > 38.0 || 
      heartRate > 90 || 
      respiratoryRate > 20
    ) {
      return 'Moderate';
    } else {
      return 'Mild';
    }
  };

  const calculateRiskScore = () => {
    const { temperature, heartRate, respiratoryRate, oxygenSaturation } = form.getValues();

    if (!temperature || !heartRate || !respiratoryRate) return 50;

    let score = 30; // baseline

    if (temperature > 38.5) score += 20;
    else if (temperature > 38.0) score += 10;

    if (heartRate > 100) score += 20;
    else if (heartRate > 90) score += 10;

    if (respiratoryRate > 22) score += 20;
    else if (respiratoryRate > 20) score += 10;

    if (oxygenSaturation && oxygenSaturation < 92) score += 20;
    else if (oxygenSaturation && oxygenSaturation < 95) score += 10;

    return Math.min(score, 100);
  };

  const onSubmit = async (values: PatientFormValues) => {
    try {
      setIsSubmitting(true);

      const patientData = {
        ...values,
        status: calculateStatus(),
        riskScore: calculateRiskScore(),
        vitalSigns: {
          temperature: values.temperature,
          heartRate: values.heartRate,
          respiratoryRate: values.respiratoryRate,
          bloodPressure: values.bloodPressureSystolic && values.bloodPressureDiastolic ? 
            `${values.bloodPressureSystolic}/${values.bloodPressureDiastolic}` : undefined,
          oxygenSaturation: values.oxygenSaturation,
        },
      };

      console.log('Submitting patient data:', patientData);

      const response = await patientService.createPatient(patientData);
      toast.success('Patient added successfully');

      navigate(`/dashboard/patients/${response.data.id}`);
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to add patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard/patients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Patient</CardTitle>
          <CardDescription>
            Enter patient information and initial vital signs
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                  <TabsTrigger value="notes">Additional Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter patient name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter age"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                console.log('Gender selected:', e.target.value);
                                field.onChange(e.target.value);
                              }}
                              value={field.value}
                              className="w-full border rounded-md p-2"
                            >
                              <option value="" disabled>Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="admissionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission Date <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            onChange={(e) => {
                              console.log('Department selected:', e.target.value);
                              field.onChange(e.target.value);
                            }}
                            value={field.value}
                            className="w-full border rounded-md p-2"
                          >
                            <option value="">Select department</option>
                            <option value="emergency">Emergency</option>
                            <option value="icu">ICU</option>
                            <option value="general">General Medicine</option>
                            <option value="cardiology">Cardiology</option>
                            <option value="pulmonary">Pulmonary</option>
                            <option value="surgery">Surgery</option>
                            <option value="pediatrics">Pediatrics</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalRecordNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Record Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter medical record number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="vitals" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter temperature"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heartRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heart Rate (bpm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter heart rate"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="respiratoryRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Respiratory Rate (/min)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter respiratory rate"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Blood Pressure (mmHg)</Label>
                      <div className="flex space-x-2">
                        <FormField
                          control={form.control}
                          name="bloodPressureSystolic"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Systolic"
                                  type="number"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span className="flex items-center">/</span>
                        <FormField
                          control={form.control}
                          name="bloodPressureDiastolic"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Diastolic"
                                  type="number"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="oxygenSaturation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Oxygen Saturation (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter SpO2"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label>Risk Assessment</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-md bg-muted">
                        <p className="text-sm font-medium">Calculated Status</p>
                        <p className="text-lg font-bold">{calculateStatus()}</p>
                      </div>

                      <div className="p-4 rounded-md bg-muted">
                        <p className="text-sm font-medium">Sepsis Risk Score</p>
                        <p className="text-lg font-bold">{calculateRiskScore()}%</p>
                        <p className="text-xs text-muted-foreground">Based on current vital signs</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter relevant medical history"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter known allergies" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter current medications"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter any additional notes or observations"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => navigate('/dashboard/patients')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Patient
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PatientsAdd;