'use client'

import React, { useState, useMemo } from 'react'
import { Student } from '@/data/generateStudentData'
import { LinearRegressionModel, StudentClusterer } from '@/lib/mlModels'
import { formatNumber, getPerformanceLevel, debounce } from '@/lib/utils'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, Download, Eye } from 'lucide-react'

interface StudentTableProps {
  students: Student[]
  mlModel: LinearRegressionModel
  clusterer: StudentClusterer
}

type SortField = keyof Student
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField | null
  direction: SortDirection
}

interface FilterConfig {
  class: string
  performanceLevel: string
  minScore: string
  maxScore: string
}

const StudentTable: React.FC<StudentTableProps> = ({ students, mlModel, clusterer }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: null, direction: 'asc' })
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    class: 'all',
    performanceLevel: 'all',
    minScore: '',
    maxScore: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  const debouncedSearch = debounce((term: string) => {
    setCurrentPage(1) // Reset to first page when searching
  }, 300)

  // Get unique classes and performance levels
  const uniqueClasses = useMemo(() => {
    return ['all', ...new Set(students.map(s => s.class))]
  }, [students])

  const performanceLevels = ['all', 'Excellent', 'Good', 'Average', 'Below Average', 'Poor']

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      // Text search
      const searchMatch = !searchTerm || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())

      // Class filter
      const classMatch = filterConfig.class === 'all' || student.class === filterConfig.class

      // Performance level filter
      const performanceMatch = filterConfig.performanceLevel === 'all' || 
        getPerformanceLevel(student.assessment_score).level === filterConfig.performanceLevel

      // Score range filter
      const minScoreMatch = !filterConfig.minScore || student.assessment_score >= Number(filterConfig.minScore)
      const maxScoreMatch = !filterConfig.maxScore || student.assessment_score <= Number(filterConfig.maxScore)

      return searchMatch && classMatch && performanceMatch && minScoreMatch && maxScoreMatch
    })

    // Sort if needed
    if (sortConfig.field) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field!]
        const bValue = b[sortConfig.field!]
        
        let comparison = 0
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue)
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue
        }
        
        return sortConfig.direction === 'desc' ? -comparison : comparison
      })
    }

    return filtered
  }, [students, searchTerm, sortConfig, filterConfig])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedStudents.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedStudents = filteredAndSortedStudents.slice(startIndex, startIndex + pageSize)

  // Handle sorting
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-primary" /> : 
      <ArrowDown className="w-4 h-4 text-primary" />
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Student ID', 'Name', 'Class', 'Comprehension', 'Attention', 'Focus', 'Retention', 'Assessment Score', 'Engagement Time']
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedStudents.map(student => [
        student.student_id,
        `"${student.name}"`,
        `"${student.class}"`,
        student.comprehension,
        student.attention,
        student.focus,
        student.retention,
        student.assessment_score,
        student.engagement_time
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Student Database</h2>
        
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, ID, or class..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                debouncedSearch(e.target.value)
              }}
              className="input pl-10 w-full"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={exportToCSV}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Class</label>
                <select
                  value={filterConfig.class}
                  onChange={(e) => setFilterConfig(prev => ({ ...prev, class: e.target.value }))}
                  className="input w-full"
                >
                  {uniqueClasses.map(cls => (
                    <option key={cls} value={cls}>
                      {cls === 'all' ? 'All Classes' : cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Performance Level</label>
                <select
                  value={filterConfig.performanceLevel}
                  onChange={(e) => setFilterConfig(prev => ({ ...prev, performanceLevel: e.target.value }))}
                  className="input w-full"
                >
                  {performanceLevels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Min Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filterConfig.minScore}
                  onChange={(e) => setFilterConfig(prev => ({ ...prev, minScore: e.target.value }))}
                  className="input w-full"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Max Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filterConfig.maxScore}
                  onChange={(e) => setFilterConfig(prev => ({ ...prev, maxScore: e.target.value }))}
                  className="input w-full"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setFilterConfig({
                  class: 'all',
                  performanceLevel: 'all',
                  minScore: '',
                  maxScore: ''
                })}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results summary */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedStudents.length} of {filteredAndSortedStudents.length} students
          </p>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="input"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        {/* Table */}
        <div className="data-table overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('student_id')}
                >
                  <div className="flex items-center gap-2">
                    Student ID
                    {getSortIcon('student_id')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('class')}
                >
                  <div className="flex items-center gap-2">
                    Class
                    {getSortIcon('class')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('comprehension')}
                >
                  <div className="flex items-center gap-2">
                    Comprehension
                    {getSortIcon('comprehension')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('attention')}
                >
                  <div className="flex items-center gap-2">
                    Attention
                    {getSortIcon('attention')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('focus')}
                >
                  <div className="flex items-center gap-2">
                    Focus
                    {getSortIcon('focus')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('retention')}
                >
                  <div className="flex items-center gap-2">
                    Retention
                    {getSortIcon('retention')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('assessment_score')}
                >
                  <div className="flex items-center gap-2">
                    Assessment Score
                    {getSortIcon('assessment_score')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('engagement_time')}
                >
                  <div className="flex items-center gap-2">
                    Engagement (min)
                    {getSortIcon('engagement_time')}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => {
                const performanceLevel = getPerformanceLevel(student.assessment_score)
                return (
                  <tr key={student.student_id}>
                    <td className="font-mono text-sm">{student.student_id}</td>
                    <td className="font-medium">{student.name}</td>
                    <td className="text-sm">{student.class}</td>
                    <td className="text-center">{formatNumber(student.comprehension)}</td>
                    <td className="text-center">{formatNumber(student.attention)}</td>
                    <td className="text-center">{formatNumber(student.focus)}</td>
                    <td className="text-center">{formatNumber(student.retention)}</td>
                    <td className="text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performanceLevel.bgColor} ${performanceLevel.color}`}>
                        {formatNumber(student.assessment_score)}
                      </span>
                    </td>
                    <td className="text-center">{student.engagement_time}</td>
                    <td>
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="btn-secondary p-2"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'btn-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? 'bg-primary text-primary-foreground'
                          : 'btn-secondary'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">Student Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="btn-secondary"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                  <p className="font-mono text-lg">{selectedStudent.student_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Class</label>
                  <p className="text-lg">{selectedStudent.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assessment Score</label>
                  <p className="text-lg font-bold text-primary">{formatNumber(selectedStudent.assessment_score)}</p>
                </div>
              </div>

              {/* Cognitive Skills */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Cognitive Skills</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Comprehension</p>
                    <p className="text-xl font-bold text-blue-600">{formatNumber(selectedStudent.comprehension)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Attention</p>
                    <p className="text-xl font-bold text-green-600">{formatNumber(selectedStudent.attention)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Focus</p>
                    <p className="text-xl font-bold text-purple-600">{formatNumber(selectedStudent.focus)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Retention</p>
                    <p className="text-xl font-bold text-orange-600">{formatNumber(selectedStudent.retention)}</p>
                  </div>
                </div>
              </div>

              {/* ML Prediction & Clustering */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">ML Prediction</h4>
                  {(() => {
                    const prediction = mlModel.predict(selectedStudent)
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Predicted Score:</span>
                          <span className="font-bold">{formatNumber(prediction.predicted_score)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span>{formatNumber(prediction.confidence * 100)}%</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Learning Persona</h4>
                  {(() => {
                    const cluster = clusterer.predictCluster(selectedStudent)
                    return cluster ? (
                      <div className="space-y-2 text-sm">
                        <p className="font-bold text-primary">{cluster.persona}</p>
                        <p className="text-muted-foreground text-xs">{cluster.description}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Unable to determine</p>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentTable