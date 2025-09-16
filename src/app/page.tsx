import Dashboard from '@/components/Dashboard'
import { studentData } from '@/data/generateStudentData'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Dashboard students={studentData} />
    </main>
  )
}