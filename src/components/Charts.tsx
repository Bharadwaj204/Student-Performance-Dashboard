'use client'

import React, { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Student } from '@/data/generateStudentData'
import { LinearRegressionModel, StudentClusterer } from '@/lib/mlModels'
import { formatNumber, getClassColor } from '@/lib/utils'

interface ChartsProps {
  students: Student[]
  mlModel: LinearRegressionModel
  clusterer: StudentClusterer
}

const Charts: React.FC<ChartsProps> = ({ students, mlModel, clusterer }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('')

  // Prepare data for different chart types
  const chartData = useMemo(() => {
    // Skills vs Assessment Score data
    const skillsScoreData = students.map(student => ({
      name: student.name,
      student_id: student.student_id,
      comprehension: student.comprehension,
      attention: student.attention,
      focus: student.focus,
      retention: student.retention,
      assessment_score: student.assessment_score,
      engagement_time: student.engagement_time
    }))

    // Class performance data
    const classStats = students.reduce((acc, student) => {
      if (!acc[student.class]) {
        acc[student.class] = {
          class: student.class,
          total_score: 0,
          total_comprehension: 0,
          total_attention: 0,
          total_focus: 0,
          total_retention: 0,
          total_engagement: 0,
          count: 0
        }
      }
      
      acc[student.class].total_score += student.assessment_score
      acc[student.class].total_comprehension += student.comprehension
      acc[student.class].total_attention += student.attention
      acc[student.class].total_focus += student.focus
      acc[student.class].total_retention += student.retention
      acc[student.class].total_engagement += student.engagement_time
      acc[student.class].count += 1
      
      return acc
    }, {} as Record<string, any>)

    const classPerformanceData = Object.values(classStats).map((cls: any) => ({
      class: cls.class,
      avg_score: cls.total_score / cls.count,
      avg_comprehension: cls.total_comprehension / cls.count,
      avg_attention: cls.total_attention / cls.count,
      avg_focus: cls.total_focus / cls.count,
      avg_retention: cls.total_retention / cls.count,
      avg_engagement: cls.total_engagement / cls.count,
      student_count: cls.count
    }))

    // Performance distribution data
    const performanceRanges = [
      { range: '90-100', label: 'Excellent', count: 0, color: '#10b981' },
      { range: '80-89', label: 'Good', count: 0, color: '#3b82f6' },
      { range: '70-79', label: 'Average', count: 0, color: '#f59e0b' },
      { range: '60-69', label: 'Below Average', count: 0, color: '#f97316' },
      { range: '0-59', label: 'Poor', count: 0, color: '#ef4444' }
    ]

    students.forEach(student => {
      const score = student.assessment_score
      if (score >= 90) performanceRanges[0].count++
      else if (score >= 80) performanceRanges[1].count++
      else if (score >= 70) performanceRanges[2].count++
      else if (score >= 60) performanceRanges[3].count++
      else performanceRanges[4].count++
    })

    // Clustering data
    const clusters = clusterer.getClusters()
    const clusterData = clusters.map(cluster => ({
      name: cluster.persona,
      comprehension: cluster.characteristics.comprehension,
      attention: cluster.characteristics.attention,
      focus: cluster.characteristics.focus,
      retention: cluster.characteristics.retention,
      avg_score: cluster.characteristics.avg_assessment_score,
      count: cluster.characteristics.count
    }))

    // Individual student radar data
    const selectedStudentData = selectedStudent
      ? students.find(s => s.student_id === selectedStudent)
      : null

    const radarData = selectedStudentData
      ? [
          { skill: 'Comprehension', value: selectedStudentData.comprehension, fullMark: 100 },
          { skill: 'Attention', value: selectedStudentData.attention, fullMark: 100 },
          { skill: 'Focus', value: selectedStudentData.focus, fullMark: 100 },
          { skill: 'Retention', value: selectedStudentData.retention, fullMark: 100 }
        ]
      : []

    return {
      skillsScoreData,
      classPerformanceData,
      performanceRanges,
      clusterData,
      radarData,
      selectedStudentData
    }
  }, [students, clusterer, selectedStudent])

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444']

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Data Visualizations</h2>
        
        {/* Class Performance Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-foreground mb-4">Average Performance by Class</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="class" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  formatter={(value: any, name: string) => [formatNumber(Number(value)), name]}
                  labelStyle={{ color: '#1e293b' }}
                />
                <Legend />
                <Bar 
                  dataKey="avg_score" 
                  name="Avg Assessment Score"
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Distribution Pie Chart */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-foreground mb-4">Performance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.performanceRanges}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, count }) => `${label}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.performanceRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attention vs Performance Scatter Plot */}
        <div className="chart-container mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Attention vs Assessment Score Correlation</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={chartData.skillsScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="attention" 
                name="Attention Score"
                domain={[0, 100]}
                stroke="#64748b"
              />
              <YAxis 
                type="number" 
                dataKey="assessment_score" 
                name="Assessment Score"
                domain={[0, 100]}
                stroke="#64748b"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Attention: {formatNumber(data.attention)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Assessment Score: {formatNumber(data.assessment_score)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter dataKey="assessment_score" fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Personas Cluster Analysis */}
        <div className="chart-container mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Learning Personas - Cognitive Skills Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.clusterData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                stroke="#64748b"
              />
              <Tooltip 
                formatter={(value: any, name: string) => [formatNumber(Number(value)), name]}
                labelStyle={{ color: '#1e293b' }}
              />
              <Legend />
              <Bar dataKey="comprehension" name="Comprehension" fill="#10b981" />
              <Bar dataKey="attention" name="Attention" fill="#3b82f6" />
              <Bar dataKey="focus" name="Focus" fill="#8b5cf6" />
              <Bar dataKey="retention" name="Retention" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Individual Student Radar Chart */}
        <div className="chart-container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-foreground">Individual Student Profile</h3>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="input min-w-[250px]"
            >
              <option value="">Select a student...</option>
              {students.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name} - {student.class}
                </option>
              ))}
            </select>
          </div>
          
          {selectedStudent && chartData.radarData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={chartData.radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Radar
                      name="Student Profile"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatNumber(Number(value)), 'Score']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Student Details */}
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Student Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium text-foreground">{chartData.selectedStudentData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class:</span>
                      <span className="font-medium text-foreground">{chartData.selectedStudentData?.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assessment Score:</span>
                      <span className="font-bold text-primary">{formatNumber(chartData.selectedStudentData?.assessment_score || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement Time:</span>
                      <span className="font-medium text-foreground">{chartData.selectedStudentData?.engagement_time} min</span>
                    </div>
                  </div>
                </div>

                {/* ML Prediction */}
                {chartData.selectedStudentData && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3">ML Prediction</h4>
                    {(() => {
                      const prediction = mlModel.predict(chartData.selectedStudentData)
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Predicted Score:</span>
                            <span className="font-bold text-primary">{formatNumber(prediction.predicted_score)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-medium text-foreground">{formatNumber(prediction.confidence * 100)}%</span>
                          </div>
                          <div className="mt-3">
                            <p className="text-muted-foreground mb-2">Top Influential Factors:</p>
                            {Object.entries(prediction.feature_importance)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 3)
                              .map(([feature, importance]) => (
                                <div key={feature} className="flex justify-between text-xs">
                                  <span className="text-muted-foreground capitalize">
                                    {feature.replace('_', ' ')}:
                                  </span>
                                  <span className="font-medium text-foreground">{formatNumber(importance)}%</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Learning Persona */}
                {chartData.selectedStudentData && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3">Learning Persona</h4>
                    {(() => {
                      const cluster = clusterer.predictCluster(chartData.selectedStudentData)
                      return cluster ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Persona:</span>
                            <span className="font-bold text-primary">{cluster.persona}</span>
                          </div>
                          <p className="text-muted-foreground text-xs mt-2">
                            {cluster.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">Unable to determine learning persona</p>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Select a student to view their cognitive skills profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Charts