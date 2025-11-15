"use client"

import type React from "react"
import { Card } from "@/components/ui/card"

export type AdminItemsListCardProps = {
  title: string
  count: number
  max: number
  isFetching: boolean
  emptyMessage: string
  children: React.ReactNode
  gridClassName?: string
}

export function AdminItemsListCard({
  title,
  count,
  max,
  isFetching,
  emptyMessage,
  children,
  gridClassName = "grid grid-cols-1 pt-3 sm:grid-cols-2 gap-1 max-h-[500px] overflow-y-auto pr-1",
}: AdminItemsListCardProps) {
  return (
    <Card className="p-4 min-h-[360px]">
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>
        <span className="text-xs text-muted-foreground">
          {count} / {max}
        </span>
      </div>

      {isFetching ? (
        <div className="h-full min-h-[320px] flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F15A25] border-t-transparent" />
        </div>
      ) : count === 0 ? (
        <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className={gridClassName}>{children}</div>
      )}
    </Card>
  )
}
