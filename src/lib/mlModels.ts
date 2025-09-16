import { Student } from '@/data/generateStudentData'

export interface MLPrediction {
  predicted_score: number
  confidence: number
  feature_importance: Record<string, number>
}

export interface ClusterResult {
  cluster_id: number
  persona: string
  description: string
  characteristics: Record<string, number>
}

export class LinearRegressionModel {
  private coefficients: Record<string, number> = {}
  private intercept: number = 0
  private isTrained: boolean = false

  train(students: Student[]): void {
    const features = ['comprehension', 'attention', 'focus', 'retention', 'engagement_time']
    const X: number[][] = students.map(student => [
      student.comprehension,
      student.attention,
      student.focus,
      student.retention,
      student.engagement_time / 100 // Normalize engagement time
    ])
    const y: number[] = students.map(student => student.assessment_score)

    // Simple linear regression using normal equation
    const result = this.fitLinearRegression(X, y, features)
    this.coefficients = result.coefficients
    this.intercept = result.intercept
    this.isTrained = true
  }

  predict(student: Partial<Student>): MLPrediction {
    if (!this.isTrained) {
      throw new Error('Model must be trained before making predictions')
    }

    const features = [
      student.comprehension || 0,
      student.attention || 0,
      student.focus || 0,
      student.retention || 0,
      (student.engagement_time || 0) / 100
    ]

    const featureNames = ['comprehension', 'attention', 'focus', 'retention', 'engagement_time']
    let prediction = this.intercept

    const importance: Record<string, number> = {}
    
    features.forEach((value, index) => {
      const contribution = value * this.coefficients[featureNames[index]]
      prediction += contribution
      importance[featureNames[index]] = Math.abs(this.coefficients[featureNames[index]])
    })

    // Normalize importance scores
    const totalImportance = Object.values(importance).reduce((sum, val) => sum + val, 0)
    Object.keys(importance).forEach(key => {
      importance[key] = (importance[key] / totalImportance) * 100
    })

    // Calculate confidence based on prediction variance
    const confidence = Math.max(0.6, Math.min(0.95, 1 - Math.abs(prediction - 75) / 100))

    return {
      predicted_score: Math.max(0, Math.min(100, prediction)),
      confidence: confidence,
      feature_importance: importance
    }
  }

  private fitLinearRegression(X: number[][], y: number[], featureNames: string[]) {
    const n = X.length
    const m = X[0].length

    // Add intercept column
    const XWithIntercept = X.map(row => [1, ...row])

    // Calculate coefficients using normal equation: (X^T * X)^-1 * X^T * y
    const XTranspose = this.transpose(XWithIntercept)
    const XTX = this.matrixMultiply(XTranspose, XWithIntercept)
    const XTXInverse = this.matrixInverse(XTX)
    const XTy = this.vectorMultiply(XTranspose, y)
    const coeffs = this.vectorMultiply(XTXInverse, XTy)

    const coefficients: Record<string, number> = {}
    featureNames.forEach((name, index) => {
      coefficients[name] = coeffs[index + 1] // Skip intercept
    })

    return {
      intercept: coeffs[0],
      coefficients
    }
  }

  private transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
  }

  private matrixMultiply(a: number[][], b: number[][]): number[][] {
    const result: number[][] = []
    for (let i = 0; i < a.length; i++) {
      result[i] = []
      for (let j = 0; j < b[0].length; j++) {
        result[i][j] = 0
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j]
        }
      }
    }
    return result
  }

  private vectorMultiply(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => 
      row.reduce((sum, val, index) => sum + val * vector[index], 0)
    )
  }

  private matrixInverse(matrix: number[][]): number[][] {
    const n = matrix.length
    const identity = Array(n).fill(0).map((_, i) => 
      Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
    )

    // Augment matrix with identity
    const augmented = matrix.map((row, i) => [...row, ...identity[i]])

    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k
        }
      }

      // Swap rows
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

      // Make diagonal element 1
      const pivot = augmented[i][i]
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot
      }

      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i]
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j]
          }
        }
      }
    }

    // Extract inverse from augmented matrix
    return augmented.map(row => row.slice(n))
  }

  getModelSummary(): Record<string, any> {
    return {
      type: 'Linear Regression',
      coefficients: this.coefficients,
      intercept: this.intercept,
      trained: this.isTrained
    }
  }
}

export class StudentClusterer {
  private clusters: ClusterResult[] = []
  private centroids: number[][] = []
  private isTrained: boolean = false

  clusterStudents(students: Student[], numClusters: number = 4): ClusterResult[] {
    const features = students.map(student => [
      student.comprehension,
      student.attention,
      student.focus,
      student.retention
    ])

    // Normalize features
    const normalizedFeatures = this.normalizeFeatures(features)

    // K-means clustering
    const { labels, centroids } = this.kmeans(normalizedFeatures, numClusters)
    
    this.centroids = centroids
    this.isTrained = true

    // Define personas based on centroids
    const personas = [
      { id: 0, name: "High Achievers", description: "Excellent performance across all cognitive skills" },
      { id: 1, name: "Balanced Learners", description: "Good overall performance with consistent skills" },
      { id: 2, name: "Developing Students", description: "Average performance with room for improvement" },
      { id: 3, name: "Struggling Learners", description: "Lower performance requiring targeted support" }
    ]

    // Sort centroids by average score to assign personas
    const centroidAverages = centroids.map((centroid, index) => ({
      index,
      average: centroid.reduce((sum, val) => sum + val, 0) / centroid.length
    })).sort((a, b) => b.average - a.average)

    this.clusters = centroidAverages.map((item, personaIndex) => {
      const centroid = centroids[item.index]
      const studentsInCluster = students.filter((_, index) => labels[index] === item.index)
      
      return {
        cluster_id: item.index,
        persona: personas[personaIndex].name,
        description: personas[personaIndex].description,
        characteristics: {
          comprehension: centroid[0] * 100,
          attention: centroid[1] * 100,
          focus: centroid[2] * 100,
          retention: centroid[3] * 100,
          count: studentsInCluster.length,
          avg_assessment_score: studentsInCluster.reduce((sum, s) => sum + s.assessment_score, 0) / studentsInCluster.length
        }
      }
    })

    return this.clusters
  }

  predictCluster(student: Partial<Student>): ClusterResult | null {
    if (!this.isTrained) return null

    const features = [
      (student.comprehension || 0) / 100,
      (student.attention || 0) / 100,
      (student.focus || 0) / 100,
      (student.retention || 0) / 100
    ]

    // Find nearest centroid
    let minDistance = Infinity
    let nearestCluster = 0

    this.centroids.forEach((centroid, index) => {
      const distance = this.euclideanDistance(features, centroid)
      if (distance < minDistance) {
        minDistance = distance
        nearestCluster = index
      }
    })

    return this.clusters.find(cluster => cluster.cluster_id === nearestCluster) || null
  }

  private normalizeFeatures(features: number[][]): number[][] {
    const numFeatures = features[0].length
    const means = Array(numFeatures).fill(0)
    const stds = Array(numFeatures).fill(0)

    // Calculate means
    features.forEach(row => {
      row.forEach((val, index) => {
        means[index] += val
      })
    })
    means.forEach((sum, index) => {
      means[index] = sum / features.length
    })

    // Calculate standard deviations
    features.forEach(row => {
      row.forEach((val, index) => {
        stds[index] += Math.pow(val - means[index], 2)
      })
    })
    stds.forEach((sum, index) => {
      stds[index] = Math.sqrt(sum / features.length)
    })

    // Normalize
    return features.map(row =>
      row.map((val, index) => (val - means[index]) / (stds[index] || 1))
    )
  }

  private kmeans(data: number[][], k: number, maxIterations: number = 100): { labels: number[], centroids: number[][] } {
    const n = data.length
    const d = data[0].length

    // Initialize centroids randomly
    let centroids: number[][] = []
    for (let i = 0; i < k; i++) {
      centroids.push(data[Math.floor(Math.random() * n)].slice())
    }

    let labels = Array(n).fill(0)

    for (let iter = 0; iter < maxIterations; iter++) {
      // Assign points to nearest centroid
      const newLabels = data.map(point => {
        let minDistance = Infinity
        let nearestCentroid = 0

        centroids.forEach((centroid, index) => {
          const distance = this.euclideanDistance(point, centroid)
          if (distance < minDistance) {
            minDistance = distance
            nearestCentroid = index
          }
        })

        return nearestCentroid
      })

      // Check for convergence
      if (newLabels.every((label, index) => label === labels[index])) {
        break
      }

      labels = newLabels

      // Update centroids
      const newCentroids: number[][] = Array(k).fill(0).map(() => Array(d).fill(0))
      const counts = Array(k).fill(0)

      data.forEach((point, index) => {
        const cluster = labels[index]
        counts[cluster]++
        point.forEach((val, dim) => {
          newCentroids[cluster][dim] += val
        })
      })

      newCentroids.forEach((centroid, index) => {
        if (counts[index] > 0) {
          centroid.forEach((sum, dim) => {
            newCentroids[index][dim] = sum / counts[index]
          })
        }
      })

      centroids = newCentroids
    }

    return { labels, centroids }
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, val, index) => sum + Math.pow(val - b[index], 2), 0)
    )
  }

  getClusters(): ClusterResult[] {
    return this.clusters
  }
}

// Utility function to calculate model performance metrics
export function calculateR2Score(actual: number[], predicted: number[]): number {
  const actualMean = actual.reduce((sum, val) => sum + val, 0) / actual.length
  
  const totalSumSquares = actual.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0)
  const residualSumSquares = actual.reduce((sum, val, index) => 
    sum + Math.pow(val - predicted[index], 2), 0)
  
  return 1 - (residualSumSquares / totalSumSquares)
}

export function calculateMSE(actual: number[], predicted: number[]): number {
  const squaredErrors = actual.map((val, index) => Math.pow(val - predicted[index], 2))
  return squaredErrors.reduce((sum, val) => sum + val, 0) / actual.length
}

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((acc, curr, i) => acc + curr * y[i], 0)
  const sumXX = x.reduce((acc, curr) => acc + curr * curr, 0)
  const sumYY = y.reduce((acc, curr) => acc + curr * curr, 0)
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
  
  return denominator === 0 ? 0 : numerator / denominator
}