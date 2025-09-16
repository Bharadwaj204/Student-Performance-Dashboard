'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Trend {
  value: number
  isPositive: boolean
}

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  trend?: Trend
  className?: string
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className
}) => {
  return (
    <div className={cn("card stats-card", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary-foreground/80 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-primary-foreground mb-2">
            {value}
          </p>
          {description && (
            <p className="text-sm text-primary-foreground/70">
              {description}
            </p>
          )}
          {trend && trend.value !== 0 && (
            <div className={cn(
              "flex items-center mt-2 text-sm",
              trend.isPositive ? "text-green-400" : "text-red-400"
            )}>
              <span className="mr-1">
                {trend.isPositive ? "↑" : "↓"}
              </span>
              <span>
                {Math.abs(trend.value).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="p-3 bg-primary-foreground/20 rounded-lg">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard