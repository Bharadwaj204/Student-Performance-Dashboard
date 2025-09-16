'use client'

import React, { useMemo } from 'react'
import { Student } from '@/data/generateStudentData'
import { LinearRegressionModel, StudentClusterer, calculateR2Score, calculateMSE } from '@/lib/mlModels'
import { formatNumber, calculateCorrelation } from '@/lib/utils'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Target,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Star
} from 'lucide-react'

interface InsightsSectionProps {
  students: Student[]
  stats: any
  mlModel: LinearRegressionModel
  clusterer: StudentClusterer
}

interface Insight {
  id: string
  type: 'success' | 'warning' | 'info' | 'danger'
  title: string
  description: string
  value?: string
  icon: React.ElementType
  actionable?: boolean
  recommendation?: string
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ 
  students, 
  stats, 
  mlModel, 
  clusterer 
}) => {
  
  // Generate comprehensive insights
  const insights: Insight[] = useMemo(() => {
    const insights: Insight[] = []

    // 1. Overall Performance Insights
    const avgScore = stats.averageScore
    if (avgScore >= 85) {
      insights.push({
        id: 'performance-excellent',
        type: 'success',
        title: 'Excellent Overall Performance',
        description: `The class maintains an outstanding average score of ${formatNumber(avgScore)}. This indicates strong academic foundation across cognitive skills.`,
        value: `${formatNumber(avgScore)} avg`,
        icon: Star,
        recommendation: 'Continue current teaching methodologies and consider them as best practices for other classes.'
      })
    } else if (avgScore >= 75) {
      insights.push({
        id: 'performance-good',
        type: 'info',
        title: 'Good Performance with Growth Potential',
        description: `Average score of ${formatNumber(avgScore)} shows solid performance with room for improvement to reach excellence.`,
        value: `${formatNumber(avgScore)} avg`,
        icon: TrendingUp,
        actionable: true,
        recommendation: 'Focus on strengthening weaker cognitive skills to push average above 85.'
      })
    } else {
      insights.push({
        id: 'performance-needs-attention',
        type: 'warning',
        title: 'Performance Requires Attention',
        description: `Average score of ${formatNumber(avgScore)} indicates significant room for improvement across the student population.`,
        value: `${formatNumber(avgScore)} avg`,
        icon: AlertTriangle,
        actionable: true,
        recommendation: 'Implement targeted interventions and additional support programs.'
      })
    }

    // 2. Correlation Insights
    const strongestCorr = Math.max(
      stats.correlations.comprehensionScore,
      stats.correlations.attentionScore,
      stats.correlations.focusScore,
      stats.correlations.retentionScore
    )
    
    const strongestSkill = Object.entries(stats.correlations).find(
      ([, corr]) => corr === strongestCorr
    )?.[0]?.replace('Score', '') || 'comprehension'

    if (strongestCorr > 0.7) {
      insights.push({
        id: 'correlation-strong',
        type: 'success',
        title: `${strongestSkill.charAt(0).toUpperCase() + strongestSkill.slice(1)} is Key Performance Driver`,
        description: `Strong correlation (${formatNumber(strongestCorr, 3)}) between ${strongestSkill} and assessment scores indicates this skill significantly impacts academic performance.`,
        value: `r = ${formatNumber(strongestCorr, 3)}`,
        icon: Brain,
        recommendation: `Prioritize ${strongestSkill} skill development in curriculum and teaching strategies.`
      })
    }

    // 3. Struggling Students Analysis
    const strugglingCount = stats.strugglingStudents
    const strugglingPercent = (strugglingCount / stats.totalStudents) * 100

    if (strugglingPercent > 20) {
      insights.push({
        id: 'struggling-high',
        type: 'danger',
        title: 'High Number of Struggling Students',
        description: `${strugglingCount} students (${formatNumber(strugglingPercent, 1)}%) are performing below 60, requiring immediate intervention.`,
        value: `${strugglingCount} students`,
        icon: AlertTriangle,
        actionable: true,
        recommendation: 'Implement individualized learning plans and additional tutoring support.'
      })
    } else if (strugglingPercent > 10) {
      insights.push({
        id: 'struggling-moderate',
        type: 'warning',
        title: 'Moderate Intervention Needed',
        description: `${strugglingCount} students (${formatNumber(strugglingPercent, 1)}%) need additional support to improve performance.`,
        value: `${strugglingCount} students`,
        icon: Users,
        actionable: true,
        recommendation: 'Provide targeted support and monitor progress closely.'
      })
    }

    // 4. Top Performers Analysis
    const topPerformersPercent = (stats.topPerformers / stats.totalStudents) * 100
    if (topPerformersPercent > 30) {
      insights.push({
        id: 'top-performers-high',
        type: 'success',
        title: 'Strong Cohort of High Achievers',
        description: `${stats.topPerformers} students (${formatNumber(topPerformersPercent, 1)}%) are excelling with scores above 85.`,
        value: `${stats.topPerformers} students`,
        icon: Star,
        recommendation: 'Consider advanced enrichment programs to further challenge high achievers.'
      })
    }

    // 5. Learning Personas Insights
    const clusters = clusterer.getClusters()
    const largestCluster = clusters.reduce((max, cluster) => 
      cluster.characteristics.count > max.characteristics.count ? cluster : max
    )

    insights.push({
      id: 'learning-personas',
      type: 'info',
      title: 'Diverse Learning Personas Identified',
      description: `Analysis reveals ${clusters.length} distinct learning personas, with "${largestCluster.persona}" being the predominant group (${largestCluster.characteristics.count} students).`,
      value: `${clusters.length} personas`,
      icon: Users,
      recommendation: 'Tailor teaching approaches to accommodate different learning personas for maximum effectiveness.'
    })

    // 6. Engagement Analysis
    const engagementCorr = stats.correlations.engagementScore
    if (Math.abs(engagementCorr) > 0.5) {
      insights.push({
        id: 'engagement-impact',
        type: engagementCorr > 0 ? 'success' : 'warning',
        title: `Study Engagement ${engagementCorr > 0 ? 'Positively' : 'Negatively'} Impacts Performance`,
        description: `${engagementCorr > 0 ? 'Strong positive' : 'Concerning negative'} correlation (${formatNumber(engagementCorr, 3)}) between study time and assessment scores.`,
        value: `r = ${formatNumber(engagementCorr, 3)}`,
        icon: BarChart3,
        actionable: true,
        recommendation: engagementCorr > 0 ? 
          'Encourage increased study engagement through interactive learning methods.' :
          'Investigate factors causing negative engagement-performance relationship.'
      })
    }

    // 7. Class Performance Variation
    const classScores = students.reduce((acc, student) => {
      if (!acc[student.class]) acc[student.class] = []
      acc[student.class].push(student.assessment_score)
      return acc
    }, {} as Record<string, number[]>)

    const classAverages = Object.entries(classScores).map(([className, scores]) => ({
      class: className,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }))

    const highestPerformingClass = classAverages.reduce((max, cls) => 
      cls.average > max.average ? cls : max
    )
    const lowestPerformingClass = classAverages.reduce((min, cls) => 
      cls.average < min.average ? cls : min
    )

    const performanceGap = highestPerformingClass.average - lowestPerformingClass.average

    if (performanceGap > 15) {
      insights.push({
        id: 'class-performance-gap',
        type: 'warning',
        title: 'Significant Performance Gap Between Classes',
        description: `${formatNumber(performanceGap, 1)} point difference between highest (${highestPerformingClass.class}: ${formatNumber(highestPerformingClass.average, 1)}) and lowest (${lowestPerformingClass.class}: ${formatNumber(lowestPerformingClass.average, 1)}) performing classes.`,
        value: `${formatNumber(performanceGap, 1)} gap`,
        icon: BarChart3,
        actionable: true,
        recommendation: `Analyze teaching methods in ${highestPerformingClass.class} and apply successful strategies to ${lowestPerformingClass.class}.`
      })
    }

    return insights
  }, [students, stats, clusterer])

  // Model Performance Analysis
  const modelPerformance = useMemo(() => {
    // Create test predictions
    const predictions = students.map(student => mlModel.predict(student).predicted_score)
    const actualScores = students.map(student => student.assessment_score)
    
    const r2Score = calculateR2Score(actualScores, predictions)
    const mse = calculateMSE(actualScores, predictions)
    
    return {
      r2Score,
      mse,
      accuracy: r2Score > 0.8 ? 'High' : r2Score > 0.6 ? 'Good' : r2Score > 0.4 ? 'Moderate' : 'Low'
    }
  }, [students, mlModel])

  // Key Recommendations
  const keyRecommendations = useMemo(() => {
    const recommendations: string[] = []
    
    // Based on insights
    insights.forEach(insight => {
      if (insight.actionable && insight.recommendation) {
        recommendations.push(insight.recommendation)
      }
    })

    // General recommendations
    if (stats.averageScore < 75) {
      recommendations.push('Implement comprehensive review sessions focusing on foundational concepts.')
    }
    
    if (stats.strugglingStudents > 0) {
      recommendations.push('Establish peer mentoring programs pairing high achievers with struggling students.')
    }

    return recommendations.slice(0, 5) // Limit to top 5
  }, [insights, stats])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'danger': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Key Insights & Recommendations</h2>
        
        {/* Model Performance Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Machine Learning Model Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">R² Score</p>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(modelPerformance.r2Score, 3)}</p>
              <p className="text-xs text-muted-foreground">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">MSE</p>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(modelPerformance.mse, 2)}</p>
              <p className="text-xs text-muted-foreground">Mean Squared Error</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">{modelPerformance.accuracy}</p>
              <p className="text-xs text-muted-foreground">Model Reliability</p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <div key={insight.id} className="card">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getInsightIcon(insight.type)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      {insight.value && (
                        <span className="text-sm font-bold text-primary">{insight.value}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    {insight.recommendation && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-foreground">{insight.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Learning Personas Detailed Analysis */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Learning Personas Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clusterer.getClusters().map((cluster, index) => (
              <div key={cluster.cluster_id} className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">{cluster.persona}</h4>
                <p className="text-xs text-muted-foreground mb-3">{cluster.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-bold">{cluster.characteristics.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Score:</span>
                    <span className="font-bold">{formatNumber(cluster.characteristics.avg_assessment_score, 1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comprehension:</span>
                    <span>{formatNumber(cluster.characteristics.comprehension, 1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attention:</span>
                    <span>{formatNumber(cluster.characteristics.attention, 1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items & Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Action Items & Recommendations
          </h3>
          <div className="space-y-4">
            {keyRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground flex-1">{recommendation}</p>
                <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Analysis Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{insights.length}</p>
              <p className="text-sm text-muted-foreground">Key Insights</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{insights.filter(i => i.actionable).length}</p>
              <p className="text-sm text-muted-foreground">Actionable Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{clusterer.getClusters().length}</p>
              <p className="text-sm text-muted-foreground">Learning Personas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(modelPerformance.r2Score * 100, 0)}%</p>
              <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsightsSection