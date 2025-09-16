'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Student } from '@/data/generateStudentData'
import { LinearRegressionModel, StudentClusterer, calculateCorrelation } from '@/lib/mlModels'
import { formatNumber, getPerformanceLevel, cn } from '@/lib/utils'
import { BarChart, ScatterChart, RadarChart, TrendingUp, Users, BookOpen, Award, Brain, Clock } from 'lucide-react'
import StatsCard from './StatsCard'
import Charts from './Charts'
import StudentTable from './StudentTable'
import InsightsSection from './InsightsSection'

interface DashboardProps {
  students: Student[]
}

interface DashboardStats {
  totalStudents: number
  averageScore: number
  averageComprehension: number
  averageAttention: number
  averageFocus: number
  averageRetention: number
  averageEngagement: number
  topPerformers: number
  strugglingStudents: number
  correlations: {
    comprehensionScore: number
    attentionScore: number
    focusScore: number
    retentionScore: number
    engagementScore: number
  }
}

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [mlModel] = useState(() => new LinearRegressionModel())
  const [clusterer] = useState(() => new StudentClusterer())
  const [isLoading, setIsLoading] = useState(true)

  // Filter students by selected class
  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') return students
    return students.filter(student => student.class === selectedClass)
  }, [students, selectedClass])

  // Calculate dashboard statistics
  const stats: DashboardStats = useMemo(() => {
    const totalStudents = filteredStudents.length
    
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        averageComprehension: 0,
        averageAttention: 0,
        averageFocus: 0,
        averageRetention: 0,
        averageEngagement: 0,
        topPerformers: 0,
        strugglingStudents: 0,
        correlations: {
          comprehensionScore: 0,
          attentionScore: 0,
          focusScore: 0,
          retentionScore: 0,
          engagementScore: 0
        }
      }
    }

    const averageScore = filteredStudents.reduce((sum, s) => sum + s.assessment_score, 0) / totalStudents
    const averageComprehension = filteredStudents.reduce((sum, s) => sum + s.comprehension, 0) / totalStudents
    const averageAttention = filteredStudents.reduce((sum, s) => sum + s.attention, 0) / totalStudents
    const averageFocus = filteredStudents.reduce((sum, s) => sum + s.focus, 0) / totalStudents
    const averageRetention = filteredStudents.reduce((sum, s) => sum + s.retention, 0) / totalStudents
    const averageEngagement = filteredStudents.reduce((sum, s) => sum + s.engagement_time, 0) / totalStudents

    const topPerformers = filteredStudents.filter(s => s.assessment_score >= 85).length
    const strugglingStudents = filteredStudents.filter(s => s.assessment_score < 60).length

    // Calculate correlations
    const scores = filteredStudents.map(s => s.assessment_score)
    const comprehensionScores = filteredStudents.map(s => s.comprehension)
    const attentionScores = filteredStudents.map(s => s.attention)
    const focusScores = filteredStudents.map(s => s.focus)
    const retentionScores = filteredStudents.map(s => s.retention)
    const engagementScores = filteredStudents.map(s => s.engagement_time)

    return {
      totalStudents,
      averageScore,
      averageComprehension,
      averageAttention,
      averageFocus,
      averageRetention,
      averageEngagement,
      topPerformers,
      strugglingStudents,
      correlations: {
        comprehensionScore: calculateCorrelation(comprehensionScores, scores),
        attentionScore: calculateCorrelation(attentionScores, scores),
        focusScore: calculateCorrelation(focusScores, scores),
        retentionScore: calculateCorrelation(retentionScores, scores),
        engagementScore: calculateCorrelation(engagementScores, scores)
      }
    }
  }, [filteredStudents])

  // Get unique classes for filter
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(students.map(s => s.class))]
    return ['all', ...uniqueClasses.sort()]
  }, [students])

  // Initialize ML models
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setIsLoading(true)
        
        // Train ML model
        mlModel.train(students)
        
        // Perform clustering
        clusterer.clusterStudents(students)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing models:', error)
        setIsLoading(false)
      }
    }

    initializeModels()
  }, [students, mlModel, clusterer])

  const performanceLevel = getPerformanceLevel(stats.averageScore)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Performance Dashboard</h1>
              <p className="text-muted-foreground mt-1">Cognitive Skills & Academic Performance Analysis</p>
            </div>
            
            {/* Class Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="class-filter" className="text-sm font-medium text-foreground">
                Filter by Class:
              </label>
              <select
                id="class-filter"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input min-w-[200px]"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>
                    {cls === 'all' ? 'All Classes' : cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'charts', label: 'Analytics', icon: BarChart },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'insights', label: 'Insights', icon: Brain }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview Stats */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Overview Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Students"
                  value={stats.totalStudents.toString()}
                  icon={Users}
                  description={`${selectedClass === 'all' ? 'All classes' : selectedClass}`}
                  trend={{ value: 0, isPositive: true }}
                />
                
                <StatsCard
                  title="Average Score"
                  value={formatNumber(stats.averageScore, 1)}
                  icon={Award}
                  description={performanceLevel.level}
                  trend={{ value: 0, isPositive: stats.averageScore >= 75 }}
                  className={performanceLevel.bgColor}
                />
                
                <StatsCard
                  title="Top Performers"
                  value={stats.topPerformers.toString()}
                  icon={TrendingUp}
                  description={`${formatNumber((stats.topPerformers / stats.totalStudents) * 100, 1)}% of students`}
                  trend={{ value: 0, isPositive: true }}
                />
                
                <StatsCard
                  title="Need Support"
                  value={stats.strugglingStudents.toString()}
                  icon={BookOpen}
                  description={`${formatNumber((stats.strugglingStudents / stats.totalStudents) * 100, 1)}% of students`}
                  trend={{ value: 0, isPositive: stats.strugglingStudents === 0 }}
                />
              </div>
            </div>

            {/* Cognitive Skills Overview */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Cognitive Skills Average</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Comprehension</p>
                      <p className="text-2xl font-bold text-foreground">{formatNumber(stats.averageComprehension)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Brain className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Attention</p>
                      <p className="text-2xl font-bold text-foreground">{formatNumber(stats.averageAttention)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Focus</p>
                      <p className="text-2xl font-bold text-foreground">{formatNumber(stats.averageFocus)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Brain className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Retention</p>
                      <p className="text-2xl font-bold text-foreground">{formatNumber(stats.averageRetention)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement (min)</p>
                      <p className="text-2xl font-bold text-foreground">{formatNumber(stats.averageEngagement, 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Correlation Summary */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Skill-Performance Correlations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.correlations).map(([skill, correlation]) => (
                  <div key={skill} className="card">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">
                        {skill.replace('Score', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={cn(
                        "text-lg font-bold",
                        correlation > 0.7 ? "text-green-600" :
                        correlation > 0.5 ? "text-blue-600" :
                        correlation > 0.3 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {formatNumber(correlation, 3)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full",
                          correlation > 0.7 ? "bg-green-600" :
                          correlation > 0.5 ? "bg-blue-600" :
                          correlation > 0.3 ? "bg-yellow-600" : "bg-red-600"
                        )}
                        style={{ width: `${Math.abs(correlation) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <Charts students={filteredStudents} mlModel={mlModel} clusterer={clusterer} />
        )}

        {activeTab === 'students' && (
          <StudentTable students={filteredStudents} mlModel={mlModel} clusterer={clusterer} />
        )}

        {activeTab === 'insights' && (
          <InsightsSection students={filteredStudents} stats={stats} mlModel={mlModel} clusterer={clusterer} />
        )}
      </main>
    </div>
  )
}

export default Dashboard