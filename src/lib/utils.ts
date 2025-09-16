import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals)
}

export function getPerformanceLevel(score: number): {
  level: string;
  color: string;
  bgColor: string;
} {
  if (score >= 90) {
    return { level: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100' }
  } else if (score >= 80) {
    return { level: 'Good', color: 'text-blue-700', bgColor: 'bg-blue-100' }
  } else if (score >= 70) {
    return { level: 'Average', color: 'text-yellow-700', bgColor: 'bg-yellow-100' }
  } else if (score >= 60) {
    return { level: 'Below Average', color: 'text-orange-700', bgColor: 'bg-orange-100' }
  } else {
    return { level: 'Poor', color: 'text-red-700', bgColor: 'bg-red-100' }
  }
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

export function getClassColor(className: string): string {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500',
    'bg-yellow-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-rose-500', 'bg-amber-500', 'bg-lime-500', 'bg-sky-500',
    'bg-fuchsia-500', 'bg-slate-500'
  ]
  
  // Simple hash function to assign consistent colors
  let hash = 0
  for (let i = 0; i < className.length; i++) {
    hash = className.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}