
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AreaChart, BarChart, LineChart, PieChart } from 'recharts';
import { Area, Bar, CartesianGrid, Cell, Legend, Line, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, Download, Filter } from 'lucide-react';
import { analyticsService } from '@/services/api';
import AnimatedSection from '@/components/AnimatedSection';
import { toast } from 'sonner';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6m');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getAnalytics();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading analytics data...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">No analytics data available</div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sepsis Analytics</h1>
          <p className="text-muted-foreground">Track sepsis cases and outcomes over time</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="6m" onValueChange={(value) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedSection animation="scale" delay={100}>
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.total}</div>
              <div className="flex items-center pt-1 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+{Math.round((analyticsData.total - 112) / 112 * 100)}% from last year</span>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={150}>
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.resolved}</div>
              <div className="flex items-center pt-1 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+{Math.round((analyticsData.resolved / analyticsData.total) * 100)}% resolution rate</span>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={200}>
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Early Detection Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round((analyticsData.detectionRate.earlyDetection / analyticsData.detectionRate.totalCases) * 100)}%
              </div>
              <div className="flex items-center pt-1 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+8% from previous system</span>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="detection">Detection Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="p-1">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sepsis Cases</CardTitle>
              <CardDescription>
                Number of sepsis cases detected per month
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData.monthly}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="cases"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorCases)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="p-1">
          <Card>
            <CardHeader>
              <CardTitle>Cases by Department</CardTitle>
              <CardDescription>
                Distribution of sepsis cases across hospital departments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.byDepartment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="cases"
                    >
                      {analyticsData.byDepartment.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="p-1">
          <Card>
            <CardHeader>
              <CardTitle>Patient Outcomes</CardTitle>
              <CardDescription>
                Status of patients following sepsis diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Recovered', value: analyticsData.patientOutcomes.recovered },
                      { name: 'Under Treatment', value: analyticsData.patientOutcomes.underTreatment },
                      { name: 'Critical', value: analyticsData.patientOutcomes.critical },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Patients" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detection" className="p-1">
          <Card>
            <CardHeader>
              <CardTitle>Detection Metrics</CardTitle>
              <CardDescription>
                Early vs. late sepsis detection rates
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Early Detection', value: analyticsData.detectionRate.earlyDetection },
                        { name: 'Late Detection', value: analyticsData.detectionRate.totalCases - analyticsData.detectionRate.earlyDetection },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#00C49F" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
