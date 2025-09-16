'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import { Student } from '@/data/generateStudentData'

interface FileUploadProps {
  onDataLoad: (students: Student[]) => void
  onError: (error: string) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoad, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [fileName, setFileName] = useState<string>('')

  const validateCSVStructure = (data: any[]): boolean => {
    if (data.length === 0) return false
    
    const requiredFields = [
      'student_id', 'name', 'class', 'comprehension', 
      'attention', 'focus', 'retention', 'assessment_score', 'engagement_time'
    ]
    
    const headers = Object.keys(data[0])
    return requiredFields.every(field => headers.includes(field))
  }

  const parseCSV = (csvText: string): Student[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    const students: Student[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const student: any = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        
        // Convert numeric fields
        if (['comprehension', 'attention', 'focus', 'retention', 'assessment_score', 'engagement_time'].includes(header)) {
          student[header] = parseFloat(value) || 0
        } else {
          student[header] = value
        }
      })
      
      students.push(student as Student)
    }
    
    return students
  }

  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onError('Please upload a CSV file.')
      setUploadStatus('error')
      return
    }

    setIsProcessing(true)
    setFileName(file.name)
    
    try {
      const text = await file.text()
      const students = parseCSV(text)
      
      if (!validateCSVStructure(students)) {
        throw new Error('Invalid CSV structure. Please ensure your CSV has the required columns: student_id, name, class, comprehension, attention, focus, retention, assessment_score, engagement_time')
      }
      
      if (students.length === 0) {
        throw new Error('No valid student data found in the CSV file.')
      }
      
      onDataLoad(students)
      setUploadStatus('success')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process the CSV file.'
      onError(errorMessage)
      setUploadStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }, [onDataLoad, onError])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const downloadSampleCSV = () => {
    // Use the public sample file
    const link = document.createElement('a')
    link.href = '/sample_student_data.csv'
    link.download = 'sample_student_data.csv'
    link.click()
  }

  const resetUpload = () => {
    setUploadStatus('idle')
    setFileName('')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Student Data</h2>
        <p className="text-muted-foreground">
          Upload a CSV file containing student performance data to generate analytics and insights.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-muted-foreground/30 hover:border-primary hover:bg-muted/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <div className="loading-spinner w-8 h-8"></div>
            <p className="text-muted-foreground">Processing your file...</p>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div>
              <p className="text-green-700 font-semibold">File uploaded successfully!</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetUpload()
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Upload Different File
            </button>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <div>
              <p className="text-red-700 font-semibold">Upload failed</p>
              <p className="text-sm text-muted-foreground">Please check your file and try again</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetUpload()
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold text-foreground">
                Drag & drop your CSV file here
              </p>
              <p className="text-muted-foreground">or click to browse</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Supports CSV files only</span>
            </div>
          </div>
        )}
      </div>

      {/* CSV Format Information */}
      <div className="mt-8 bg-muted/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Required CSV Format
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Your CSV file must contain the following columns:
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs bg-background rounded p-3 font-mono">
              <span>student_id</span>
              <span>name</span>
              <span>class</span>
              <span>comprehension</span>
              <span>attention</span>
              <span>focus</span>
              <span>retention</span>
              <span>assessment_score</span>
              <span>engagement_time</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Value ranges:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Cognitive skills</strong> (comprehension, attention, focus, retention): 0-100</li>
              <li>• <strong>Assessment score</strong>: 0-100</li>
              <li>• <strong>Engagement time</strong>: Minutes per day (e.g., 30-300)</li>
            </ul>
          </div>
          
          <button
            onClick={downloadSampleCSV}
            className="btn-secondary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download Sample CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileUpload