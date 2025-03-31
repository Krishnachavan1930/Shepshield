import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AnimatedSection from '@/components/AnimatedSection';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays } from 'date-fns';
import { CalendarIcon, RefreshCw, AlertTriangle, Stethoscope, Activity, HeartPulse } from 'lucide-react';
import { analyticsService } from '@/services/api';

// Types
type PatientMetrics = {
  date: string;
  patientsTreated: number;
  positiveOutcomes: number;
  sepsisAlerts: number;
  avgTreatmentTime: number;
  readmissions: number;
};

type TimeRange = '24h' | '7d' | '30d' | 'custom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock data generator for healthcare metrics
const generatePatientData = (days: number): PatientMetrics[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - i - 1);
    const basePatients = Math.floor(Math.random() * 40) + 60;
    return {
      date: format(date, 'MMM dd'),
      patientsTreated: basePatients,
      positiveOutcomes: Math.floor(basePatients * 0.85) - Math.floor(Math.random() * 10),
      sepsisAlerts: Math.floor(Math.random() * 8) + 2,
      avgTreatmentTime: Math.floor(Math.random() * 120) + 60, // minutes
      readmissions: Math.floor(Math.random() * 5) + 1,
    };
  });
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [data, setData] = useState<PatientMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [generalAnalytics, setGeneralAnalytics] = useState<any>(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch general analytics
        const generalData = await analyticsService.getAnalytics();
        setGeneralAnalytics(generalData.data.data);

        // Fetch monthly data
        const monthlyData = await analyticsService.getMonthlyData();
        console.log(monthlyData);
        console.log(generalAnalytics);
        // Transform monthly data to match our PatientMetrics type
        const transformedData = monthlyData.data.data.map((item: any) => ({
          date: format(new Date(item.month), 'MMM dd'),
          patientsTreated: item.cases,
          positiveOutcomes: Math.floor(item.cases * 0.85), // Approximation
          sepsisAlerts: Math.floor(item.cases * 0.1), // Approximation
          avgTreatmentTime: 90, // This would need to come from actual  // Static approximation
          readmissions: Math.floor(item.cases * 0.05), // Approximation
        }));
        console.log(transformedData);
        setData(transformedData);
        toast.success('Loaded patient data successfully');
      } catch (error) {
        toast.error('Failed to load patient metrics');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, dateRange]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const generalData = await analyticsService.getAnalytics();
      setGeneralAnalytics(generalData);
      toast.success('Patient data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals from general analytics
  const totals = generalAnalytics ? {
    patientsTreated: generalAnalytics.total,
    positiveOutcomes: generalAnalytics.patientOutcomes.recovered,
    sepsisAlerts: generalAnalytics.active - generalAnalytics.patientOutcomes.underTreatment, // Approximation
    avgTreatmentTime: 90, // Static value since not available in backend
    readmissions: Math.floor(generalAnalytics.total * 0.05), // Approximation
  } : {
    patientsTreated: 0,
    positiveOutcomes: 0,
    sepsisAlerts: 0,
    avgTreatmentTime: 0,
    readmissions: 0
  };
  // Fetch data based on time range
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        let days = 7;
        if (timeRange === '24h') days = 1;
        if (timeRange === '30d') days = 30;
        if (timeRange === 'custom' && dateRange?.from && dateRange.to) {
          days = Math.ceil(
            (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        const mockData = generatePatientData(days);
        setData(mockData);
        toast.success(`Loaded ${days} days of patient data`);
      } catch (error) {
        toast.error('Failed to load patient metrics');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, dateRange]);

  // const refreshData = () => {
  //   setData(generatePatientData(data.length));
  //   toast.success('Patient data refreshed');
  // };

  // Calculate totals
  // const totals = data.reduce(
  //   (acc, curr) => ({
  //     patientsTreated: acc.patientsTreated + curr.patientsTreated,
  //     positiveOutcomes: acc.positiveOutcomes + curr.positiveOutcomes,
  //     sepsisAlerts: acc.sepsisAlerts + curr.sepsisAlerts,
  //     avgTreatmentTime: acc.avgTreatmentTime + curr.avgTreatmentTime / data.length,
  //     readmissions: acc.readmissions + curr.readmissions,
  //   }),
  //   { patientsTreated: 0, positiveOutcomes: 0, sepsisAlerts: 0, avgTreatmentTime: 0, readmissions: 0 }
  // );

  // Calculate success rate
  const successRate = totals.patientsTreated > 0 
    ? (totals.positiveOutcomes / totals.patientsTreated * 100).toFixed(1)
    : 0;

  return (
    <AnimatedSection>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Patient Care Analytics</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Button
                variant={timeRange === '24h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('24h')}
              >
                24h
              </Button>
              <Button
                variant={timeRange === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7d')}
              >
                7d
              </Button>
              <Button
                variant={timeRange === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30d')}
              >
                30d
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={timeRange === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('custom')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Custom
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Patients Treated"
            value={totals.patientsTreated.toLocaleString()}
            change="+5.2%"
            icon={<Stethoscope className="h-5 w-5" />}
          />
          <MetricCard
            title="Success Rate"
            value={`${successRate}%`}
            change="+2.1%"
            icon={<HeartPulse className="h-5 w-5" />}
          />
          <MetricCard
            title="Sepsis Alerts"
            value={totals.sepsisAlerts.toLocaleString()}
            change="-1.3%"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <MetricCard
            title="Avg. Treatment Time"
            value={`${totals.avgTreatmentTime.toFixed(0)} mins`}
            change="-4.5%"
            icon={<Activity className="h-5 w-5" />}
          />
        </div>

        {/* Chart Type Selector */}
        <div className="flex justify-end gap-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line Chart
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </Button>
        </div>

        {/* Main Chart */}
        <div className="bg-card rounded-lg border p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="patientsTreated"
                  stroke="#0088FE"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="Patients Treated"
                />
                <Line
                  type="monotone"
                  dataKey="positiveOutcomes"
                  stroke="#00C49F"
                  strokeWidth={2}
                  name="Positive Outcomes"
                />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patientsTreated" fill="#0088FE" name="Patients Treated" />
                <Bar dataKey="positiveOutcomes" fill="#00C49F" name="Positive Outcomes" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sepsis Alerts Chart */}
          <div className="bg-card rounded-lg border p-4 h-80">
            <h3 className="text-lg font-semibold mb-4">Sepsis Alerts</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sepsisAlerts"
                  stroke="#FF8042"
                  strokeWidth={2}
                  name="Sepsis Alerts"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Outcomes Pie Chart */}
          <div className="bg-card rounded-lg border p-4 h-80">
            <h3 className="text-lg font-semibold mb-4">Patient Outcomes</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive Outcomes', value: totals.positiveOutcomes },
                    { name: 'Readmissions', value: totals.readmissions },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-4">Detailed Patient Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Patients Treated</th>
                  <th className="px-4 py-2 text-left">Positive Outcomes</th>
                  <th className="px-4 py-2 text-left">Success Rate</th>
                  <th className="px-4 py-2 text-left">Sepsis Alerts</th>
                  <th className="px-4 py-2 text-left">Avg. Treatment Time</th>
                  <th className="px-4 py-2 text-left">Readmissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row) => (
                  <tr key={row.date}>
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.patientsTreated.toLocaleString()}</td>
                    <td className="px-4 py-2">{row.positiveOutcomes.toLocaleString()}</td>
                    <td className="px-4 py-2">{((row.positiveOutcomes / row.patientsTreated) * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2">{row.sepsisAlerts}</td>
                    <td className="px-4 py-2">{row.avgTreatmentTime.toFixed(0)} mins</td>
                    <td className="px-4 py-2">{row.readmissions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-foreground">{icon}</span>
      </div>
      <p
        className={`text-sm mt-2 ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {change} vs previous period
      </p>
    </div>
  );
}