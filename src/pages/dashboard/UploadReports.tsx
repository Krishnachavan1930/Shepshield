"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Download, FileText, Upload, X } from "lucide-react"

const UploadReports = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "completed" | "error">("idle")

  // Updated file upload function with API call
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Start upload process
    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)

          // Add uploaded filenames to state
          const newFiles = Array.from(files).map((file) => file.name)
          setUploadedFiles((prev) => [...prev, ...newFiles])

          return 100
        }
        return prev + 10
      })
    }, 300)

    try {
      // Find CSV file if any
      const csvFile = Array.from(files).find((file) => file.name.toLowerCase().endsWith(".csv"))

      if (csvFile) {
        // Create form data for API call
        const formData = new FormData()
        formData.append("file", csvFile)
        formData.append("key", "file") // Key file as mentioned in requirements
        formData.append("uploadedBy", "ky") // uploadedBy value as mentioned

        // Call the API endpoint
        const response = await fetch("http://localhost:5001/api/patients/uploadcsv", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          // API call successful
          setProcessingStatus("completed")
        } else {
          // API call failed
          setProcessingStatus("error")
          console.error("Failed to upload CSV:", await response.text())
        }
      } else {
        // No CSV file found, just simulate processing
        setTimeout(() => {
          setProcessingStatus("processing")
          setTimeout(() => setProcessingStatus("completed"), 3000)
        }, 1000)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setProcessingStatus("error")
    }
  }

  // Remove file from uploaded files
  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file !== filename))
  }

  // Reset the form
  const resetForm = () => {
    setUploadedFiles([])
    setProcessingStatus("idle")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Reports</h1>
        <p className="text-muted-foreground">Import patient data, lab results, and medical records</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 h-auto">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
          <TabsTrigger value="settings">Upload Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Reports</CardTitle>
              <CardDescription>
                Drag and drop files, or browse your computer for patient reports and lab results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  uploading ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                {!uploading ? (
                  <div className="py-8 space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/60" />
                    <div>
                      <h3 className="text-lg font-medium">Drag files here or click to browse</h3>
                      <p className="text-sm text-muted-foreground mt-1">Support for CSV, PDF, XLSX, and DICOM files</p>
                    </div>
                    <Input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} multiple />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Select Files
                      </label>
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <h3 className="text-lg font-medium">Uploading...</h3>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Uploaded Files</h3>
                  <div className="border rounded-md divide-y">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{file}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeFile(file)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {processingStatus === "processing" && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Processing Files</AlertTitle>
                  <AlertDescription>
                    Your files are being processed and analyzed. This may take a few moments.
                  </AlertDescription>
                </Alert>
              )}

              {processingStatus === "completed" && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Upload Complete</AlertTitle>
                  <AlertDescription className="text-green-700">
                    All files have been successfully uploaded and processed. Data is now available in the system.
                  </AlertDescription>
                </Alert>
              )}

              {processingStatus === "error" && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <X className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Upload Failed</AlertTitle>
                  <AlertDescription className="text-red-700">
                    There was an error processing your files. Please check the console for details and try again.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 justify-between">
              <div className="flex gap-2">
                <Button
                  variant="default"
                  disabled={uploadedFiles.length === 0 || uploading || processingStatus === "processing"}
                >
                  Process Files
                </Button>
                <Button variant="outline" onClick={resetForm} disabled={uploadedFiles.length === 0 || uploading}>
                  Reset
                </Button>
              </div>
              <div>
                <Button variant="outline" size="sm" className="text-xs">
                  Upload Guidelines
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Templates</CardTitle>
              <CardDescription>Download standardized templates for data uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Patient Data</h3>
                      <p className="text-xs text-muted-foreground">CSV template</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Lab Results</h3>
                      <p className="text-xs text-muted-foreground">XLSX template</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Vital Signs</h3>
                      <p className="text-xs text-muted-foreground">CSV template</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Review past uploaded files and import status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <Input placeholder="Search uploads..." className="w-full sm:w-60" />
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="week">
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium border-b">
                    <div className="col-span-5 sm:col-span-4">File Name</div>
                    <div className="col-span-3 sm:col-span-2 text-center">Status</div>
                    <div className="col-span-4 sm:col-span-2 text-center">Type</div>
                    <div className="hidden sm:block sm:col-span-2 text-center">Date</div>
                    <div className="hidden sm:block sm:col-span-2 text-center">Size</div>
                  </div>

                  <div className="divide-y max-h-80 overflow-auto">
                    <div className="grid grid-cols-12 gap-2 p-3 text-sm items-center">
                      <div className="col-span-5 sm:col-span-4 font-medium">patient_data_2023.csv</div>
                      <div className="col-span-3 sm:col-span-2 text-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Success
                        </Badge>
                      </div>
                      <div className="col-span-4 sm:col-span-2 text-center">Patient Data</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">2023-09-15</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">1.2 MB</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 p-3 text-sm items-center">
                      <div className="col-span-5 sm:col-span-4 font-medium">lab_results_batch_45.xlsx</div>
                      <div className="col-span-3 sm:col-span-2 text-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Success
                        </Badge>
                      </div>
                      <div className="col-span-4 sm:col-span-2 text-center">Lab Results</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">2023-09-14</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">3.5 MB</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 p-3 text-sm items-center">
                      <div className="col-span-5 sm:col-span-4 font-medium">vitals_monitoring_icu.csv</div>
                      <div className="col-span-3 sm:col-span-2 text-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Success
                        </Badge>
                      </div>
                      <div className="col-span-4 sm:col-span-2 text-center">Vitals</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">2023-09-14</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">2.8 MB</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 p-3 text-sm items-center">
                      <div className="col-span-5 sm:col-span-4 font-medium">medical_reports_august.pdf</div>
                      <div className="col-span-3 sm:col-span-2 text-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Success
                        </Badge>
                      </div>
                      <div className="col-span-4 sm:col-span-2 text-center">Reports</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">2023-09-13</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">8.6 MB</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 p-3 text-sm items-center">
                      <div className="col-span-5 sm:col-span-4 font-medium">patient_imaging_data.dicom</div>
                      <div className="col-span-3 sm:col-span-2 text-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Success
                        </Badge>
                      </div>
                      <div className="col-span-4 sm:col-span-2 text-center">Imaging</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">2023-09-12</div>
                      <div className="hidden sm:block sm:col-span-2 text-center text-muted-foreground">15.2 MB</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Settings</CardTitle>
              <CardDescription>Configure data upload preferences and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">File Upload Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm">Maximum File Size</label>
                      <Select defaultValue="25">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 MB</SelectItem>
                          <SelectItem value="25">25 MB</SelectItem>
                          <SelectItem value="50">50 MB</SelectItem>
                          <SelectItem value="100">100 MB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm">File Types Allowed</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Formats</SelectItem>
                          <SelectItem value="data">Data Files Only</SelectItem>
                          <SelectItem value="docs">Documents Only</SelectItem>
                          <SelectItem value="images">Images Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Data Processing</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm">Auto-Processing</label>
                      <Select defaultValue="enabled">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm">Notification Preference</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Notifications</SelectItem>
                          <SelectItem value="errors">Errors Only</SelectItem>
                          <SelectItem value="none">No Notifications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Data Validation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm">Validation Level</label>
                      <Select defaultValue="strict">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Strict</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm">On Error</label>
                      <Select defaultValue="reject">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reject">Reject File</SelectItem>
                          <SelectItem value="warn">Warn and Continue</SelectItem>
                          <SelectItem value="ignore">Ignore Errors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UploadReports

