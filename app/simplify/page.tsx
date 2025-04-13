"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Upload, X, Check, Copy, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

export default function SimplifyPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [simplifiedContent, setSimplifiedContent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("simplified")

  // Mock original document content
  const originalContent = `WHEREAS, the Lessor is the owner of the premises situated at [Property Address], hereinafter referred to as the "Premises";

AND WHEREAS, the Lessee has approached the Lessor for taking the Premises on lease for residential purposes;

AND WHEREAS, the Lessor has agreed to grant lease of the Premises to the Lessee on the terms and conditions hereinafter contained;

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. TERM OF LEASE:
   The Lessor hereby grants to the Lessee the lease of the Premises for a period of 11 (eleven) months commencing from [Start Date] and ending on [End Date], which may be renewed for a similar period by mutual consent of both parties.

2. RENT:
   The Lessee shall pay to the Lessor a monthly rent of Rs. [Amount in Figures]/- (Rupees [Amount in Words] only) payable in advance on or before the 5th day of each English calendar month.

3. SECURITY DEPOSIT:
   The Lessee has paid to the Lessor a sum of Rs. [Amount in Figures]/- (Rupees [Amount in Words] only) as interest-free refundable security deposit, which shall be refunded by the Lessor to the Lessee at the time of vacating the Premises after deducting therefrom any amounts due from the Lessee to the Lessor under this Agreement.

4. MAINTENANCE CHARGES:
   The Lessee shall pay the monthly maintenance charges as applicable and as determined by the [Society/Association] of the building in which the Premises is situated.

5. UTILITIES:
   The Lessee shall pay all charges for electricity, water, gas, and other utilities consumed in the Premises during the term of the lease as per the respective meter readings or as determined by the respective authorities.

6. USE OF PREMISES:
   The Lessee shall use the Premises for residential purposes only and shall not use the same for any illegal, immoral, or commercial purposes.

7. REPAIRS AND MAINTENANCE:
   a) The Lessor shall be responsible for major structural repairs.
   b) The Lessee shall be responsible for minor day-to-day repairs and maintenance of the Premises.
   c) The Lessee shall maintain the Premises in good and tenantable condition.

8. ALTERATIONS:
   The Lessee shall not make any structural alterations or additions to the Premises without the prior written consent of the Lessor.

9. ASSIGNMENT AND SUBLETTING:
   The Lessee shall not assign, sublet, or part with the possession of the Premises or any part thereof without the prior written consent of the Lessor.

10. TERMINATION:
    Either party may terminate this Agreement by giving 2 (two) months' prior written notice to the other party.

11. JURISDICTION:
    Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts in [City].

IN WITNESS WHEREOF, the parties hereto have set their hands on the day, month, and year first above written.

SIGNED AND DELIVERED by the within named LESSOR
_______________________
[Lessor's Name]

SIGNED AND DELIVERED by the within named LESSEE
_______________________
[Lessee's Name]

WITNESSES:
1. _______________________
2. _______________________`

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      handleFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      handleFile(selectedFile)
    }
  }

  const handleFile = (selectedFile: File) => {
    // Check if file is a PDF or document
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or text file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setSimplifiedContent(null)
  }

  const removeFile = () => {
    setFile(null)
    setSimplifiedContent(null)
  }

  const processFile = () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            // Mock simplified content
            setSimplifiedContent(`This is a Rental Agreement between the property owner (Landlord) and you (Tenant) for the property at [Property Address].

Key Points:
1. Rental Period: 11 months from [Start Date] to [End Date], can be renewed if both agree
2. Monthly Rent: Rs. [Amount] due by the 5th of each month
3. Security Deposit: Rs. [Amount] (refundable when you move out, minus any damages)
4. You must pay:
   - Monthly maintenance charges to the building society
   - All utility bills (electricity, water, gas)
5. The property is for residential use only, not for business or illegal activities
6. Repairs:
   - Landlord handles major structural repairs
   - You handle small day-to-day maintenance
7. You cannot make structural changes without written permission
8. You cannot sublet or let someone else live there without permission
9. Either party can end this agreement with 2 months' written notice
10. Any disputes will be handled by courts in [City]

This document needs signatures from:
- The Landlord
- You (the Tenant)
- Two witnesses`)
            setIsProcessing(false)
          }, 500)
        }
        return newProgress
      })
    }, 100)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  const downloadText = (text: string, filename: string) => {
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-slate-100">Legal Document Simplifier</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Upload your legal document and get a simplified, easy-to-understand explanation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Our AI simplifies complex legal documents into plain language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 dark:bg-teal-900 rounded-full p-2 mt-0.5">
                  <span className="text-teal-600 dark:text-teal-300 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Upload Your Document</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upload any legal document (PDF, Word, or text file)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-teal-100 dark:bg-teal-900 rounded-full p-2 mt-0.5">
                  <span className="text-teal-600 dark:text-teal-300 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">AI Processing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Our AI analyzes the document and identifies key legal terms and concepts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-teal-100 dark:bg-teal-900 rounded-full p-2 mt-0.5">
                  <span className="text-teal-600 dark:text-teal-300 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Get Simplified Explanation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receive a clear, plain-language explanation of the document's content and implications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Supported formats: PDF, Word, Text (Max 10MB)</CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                      <Upload className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Drag and drop your file here, or{" "}
                        <label className="text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PDF, Word, or Text files up to 10MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700">
                        <FileText className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800"
                    onClick={processFile}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Simplify Document"}
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                    Analyzing document... {progress}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {simplifiedContent && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Document Analysis</CardTitle>
                <CardDescription>We've simplified your legal document into plain language</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="simplified">Simplified Version</TabsTrigger>
                    <TabsTrigger value="original">Original Document</TabsTrigger>
                  </TabsList>

                  <TabsContent value="simplified">
                    <div className="relative">
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(simplifiedContent)}>
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadText(simplifiedContent, "simplified-document.txt")}
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download
                        </Button>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mt-10">
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                          {simplifiedContent.split("\n\n").map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="original">
                    <div className="relative">
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(originalContent)}>
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadText(originalContent, "original-document.txt")}
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download
                        </Button>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mt-10">
                        <pre className="text-sm whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-200">
                          {originalContent}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-lg p-4 flex items-start space-x-3">
              <div className="shrink-0">
                <Check className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="font-medium text-teal-800 dark:text-teal-300">Document Successfully Simplified</h3>
                <p className="text-sm text-teal-700 dark:text-teal-400 mt-1">
                  We've simplified your legal document into plain language. You can now better understand the key terms
                  and implications.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <Separator className="my-8 dark:bg-slate-700" />

        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-navy-900 dark:text-slate-100">Need More Help?</h2>
          <p className="text-slate-600 dark:text-slate-300">
            If you need personalized assistance understanding your legal documents, connect with a legal professional.
          </p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800">
            <a href="/help">Find Legal Help</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
