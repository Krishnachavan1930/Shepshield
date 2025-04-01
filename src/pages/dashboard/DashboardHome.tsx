"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  AlertCircle,
  Lightbulb,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { patientService } from "@/services/api";

interface StatusResponse {
  mlModelStatus: boolean;
  alertSystemStatus: boolean;
  dbStatus: boolean;
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [averageRiskScore, setAverageRiskScore] = useState(0);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<{
    activePatients: number;
    activePatientsChange: number;
    sepsisAlerts: number;
    sepsisAlertsChange: number;
    reportsProcessed: number;
    reportsProcessedChange: number;
    predictedOutcomes: number;
    averageRiskScore: number;
    departmentCounts: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      console.log("Fetching");
      const response = await axios.get<StatusResponse>(
        "http://localhost:5454/api/checkStatus"
      );
      console.log(response.data);
      setStatus(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await patientService.getAllPatients();
        const data = response.data.data;
        console.log(data);
        setRecentPatients(data);
      } catch (err) {
        console.error("Error fetching patient data", err);
      }
    };
    fetchPatientData();
  }, []);

  useEffect(() => {
    const fetchRiskScore = async () => {
      try {
        const response = await fetch(
          "http://localhost:5454/patients/api/dashboard/"
        );
        const data = await response.json();
        setDashboardData(data);
        console.log(data);
        setAverageRiskScore(parseFloat(data.averageRiskScore));
      } catch (error) {
        console.error("Error fetching average risk score:", error);
        setAverageRiskScore(0);
      } finally {
        setLoading(false);
      }
    };
    fetchRiskScore();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Dr. John Doe</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedSection animation="scale" delay={100}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData ? dashboardData.activePatients : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData ? dashboardData.activePatientsChange : 0} from
                today
              </p>
              <Progress className="mt-2" value={72} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={150}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sepsis Alerts
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData ? dashboardData.sepsisAlerts : 0}
              </div>
              <p className="text-xs text-destructive">
                {dashboardData ? dashboardData.sepsisAlertsChange : 0} new
                alerts today
              </p>
              <Progress className="mt-2" value={28} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={200}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Risk Score
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : `${averageRiskScore}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Calculated across all patients
              </p>
              <Progress className="mt-2" value={averageRiskScore || 0} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={250}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Predicted Outcomes
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData ? dashboardData.predictedOutcomes : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Number of outcomes predicted
              </p>
              <Progress className="mt-2" value={93} />
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedSection animation="slide-right">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                Recent patients monitored for sepsis risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${getRiskColor(
                          patient.riskLevel
                        )}`}
                      />
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {patient.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p
                        className={`font-medium ${getRiskTextColor(
                          patient.riskLevel
                        )}`}
                      >
                        {patient.riskLevel} Risk
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.lastUpdated}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/dashboard/patients")}
              >
                View All Patients
              </Button>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="slide-left">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Risk Trends</CardTitle>
              <CardDescription>
                Sepsis detection by department (last 30 days)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData &&
                  Object.entries(dashboardData.departmentCounts).map(
                    ([name, cases]) => {
                      const previousCases = 10; 
                      const change = previousCases
                        ? (
                            ((cases - previousCases) / previousCases) *
                            100
                          ).toFixed(1)
                        : 0;
                      const trend = cases > previousCases ? "up" : "down";
                      const percentage = (cases / 100) * 100;

                      return (
                        <div key={name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p className="font-medium">{name}</p>
                              <div className="text-xs text-muted-foreground flex items-center">
                                {trend === "up" ? (
                                  <ArrowUp className="h-3 w-3 text-destructive mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                                )}
                                <span>{change}% from previous month</span>
                              </div>
                            </div>
                            <p className="font-medium">{cases} cases</p>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      );
                    }
                  )}

                <Button variant="outline" className="w-full mt-4">
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <AnimatedSection animation="scale" delay={100}>
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {/* <Button variant="outline" className="justify-start">
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload New Report
                </Button> */}
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/dashboard/patients/add")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/dashboard/analytics")}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Review Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={150}>
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schedule.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.type === "meeting"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.type}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={200}>
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* ML Model Status */}
                <div className="flex justify-between items-center">
                  <p className="text-sm">ML Model Status</p>
                  <div
                    className={`flex items-center ${
                      status?.mlModelStatus ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full mr-1 ${
                        status?.mlModelStatus ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    <span className="text-xs">
                      {status?.mlModelStatus ? "Operational" : "Down"}
                    </span>
                  </div>
                </div>

                {/* Database Sync */}
                <div className="flex justify-between items-center">
                  <p className="text-sm">Database Sync</p>
                  <div
                    className={`flex items-center ${
                      status ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full mr-1 ${
                        status ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    <span className="text-xs">
                      {status ? "Operational" : "Down"}
                    </span>
                  </div>
                </div>

                {/* Alert System */}
                <div className="flex justify-between items-center">
                  <p className="text-sm">Alert System</p>
                  <div
                    className={`flex items-center ${
                      status ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full mr-1 ${
                        status ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    <span className="text-xs">
                      {status ? "Operational" : "Down"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

const schedule = [
  { title: "Department Meeting", time: "09:00 AM - 10:30 AM", type: "meeting" },
  { title: "Patient Rounds", time: "11:00 AM - 01:00 PM", type: "rounds" },
  {
    title: "Research Discussion",
    time: "02:30 PM - 03:30 PM",
    type: "meeting",
  },
  { title: "Evening Rounds", time: "04:30 PM - 06:00 PM", type: "rounds" },
];


const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getRiskTextColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "text-red-500";
    case "Medium":
      return "text-yellow-500";
    case "Low":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

export default DashboardHome;
