"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, AlertCircle, Lightbulb, ArrowUp, ArrowDown } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"

const DashboardHome = () => {
  const navigate = useNavigate()
  const [averageRiskScore, setAverageRiskScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRiskScore = async () => {
      try {
        const response = await fetch("https://your-backend-api.com/risk-score/average")
        const data = await response.json()
        setAverageRiskScore(data.averageRiskScore)
      } catch (error) {
        console.error("Error fetching average risk score:", error)
        // Set a default value in case of error
        setAverageRiskScore(0)
      } finally {
        setLoading(false)
      }
    }
    fetchRiskScore()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Dr. John Doe</p>
        </div>
        {/* <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline">Export Report</Button>
          <Button>Quick Actions</Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedSection animation="scale" delay={100}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
              <Progress className="mt-2" value={72} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={150}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sepsis Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-destructive">+3 new alerts today</p>
              <Progress className="mt-2" value={28} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={200}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : `${averageRiskScore}%`}</div>
              <p className="text-xs text-muted-foreground">Calculated across all patients</p>
              <Progress className="mt-2" value={averageRiskScore || 0} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={250}>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predicted Outcomes</CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93%</div>
              <p className="text-xs text-muted-foreground">Accuracy rate</p>
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
              <CardDescription>Recent patients monitored for sepsis risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(patient.riskLevel)}`} />
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className={`font-medium ${getRiskTextColor(patient.riskLevel)}`}>{patient.riskLevel} Risk</p>
                      <p className="text-xs text-muted-foreground">{patient.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Patients
              </Button>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="slide-left">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Risk Trends</CardTitle>
              <CardDescription>Sepsis detection by department (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departments.map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">{dept.name}</p>
                        <div className="text-xs text-muted-foreground flex items-center">
                          {dept.trend === "up" ? (
                            <ArrowUp className="h-3 w-3 text-destructive mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                          )}
                          <span>{dept.change}% from previous month</span>
                        </div>
                      </div>
                      <p className="font-medium">{dept.cases} cases</p>
                    </div>
                    <Progress value={dept.percentage} />
                  </div>
                ))}
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
                <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/patients/add")}>
                  <Users className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/analytics")}>
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
                  <div key={i} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.type === "meeting" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
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
                <div className="flex justify-between items-center">
                  <p className="text-sm">ML Model Status</p>
                  <div className="flex items-center text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
                    <span className="text-xs">Operational</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Database Sync</p>
                  <div className="flex items-center text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
                    <span className="text-xs">Updated 5m ago</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Alert System</p>
                  <div className="flex items-center text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
                    <span className="text-xs">Operational</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Hospital API</p>
                  <div className="flex items-center text-yellow-600">
                    <span className="h-2 w-2 rounded-full bg-yellow-600 mr-1"></span>
                    <span className="text-xs">Minor Disruption</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  System Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}

// Sample data
const recentPatients = [
  {
    id: "P-1234",
    name: "Emily Johnson",
    riskLevel: "High",
    lastUpdated: "10 mins ago",
  },
  {
    id: "P-2345",
    name: "Robert Smith",
    riskLevel: "Medium",
    lastUpdated: "25 mins ago",
  },
  {
    id: "P-3456",
    name: "Maria Garcia",
    riskLevel: "Low",
    lastUpdated: "1 hour ago",
  },
  {
    id: "P-4567",
    name: "James Wilson",
    riskLevel: "High",
    lastUpdated: "2 hours ago",
  },
  {
    id: "P-5678",
    name: "Linda Chen",
    riskLevel: "Medium",
    lastUpdated: "3 hours ago",
  },
]

const departments = [
  { name: "Emergency", cases: 42, percentage: 75, trend: "up", change: 12 },
  { name: "ICU", cases: 28, percentage: 50, trend: "up", change: 8 },
  {
    name: "General Medicine",
    cases: 18,
    percentage: 32,
    trend: "down",
    change: 5,
  },
  { name: "Pediatrics", cases: 7, percentage: 12, trend: "down", change: 10 },
]

const schedule = [
  { title: "Department Meeting", time: "09:00 AM - 10:30 AM", type: "meeting" },
  { title: "Patient Rounds", time: "11:00 AM - 01:00 PM", type: "rounds" },
  {
    title: "Research Discussion",
    time: "02:30 PM - 03:30 PM",
    type: "meeting",
  },
  { title: "Evening Rounds", time: "04:30 PM - 06:00 PM", type: "rounds" },
]

// Helper functions
const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "bg-red-500"
    case "Medium":
      return "bg-yellow-500"
    case "Low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

const getRiskTextColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "text-red-500"
    case "Medium":
      return "text-yellow-500"
    case "Low":
      return "text-green-500"
    default:
      return "text-gray-500"
  }
}

export default DashboardHome

