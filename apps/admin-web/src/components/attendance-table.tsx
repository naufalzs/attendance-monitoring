import { useState } from 'react'
import { AttendanceRows } from '@/components/attendance/attendance-rows'
import { TablePagination } from '@/components/attendance/table-pagination'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAttendancePage } from '@/hooks/use-attendance-page'

export function AttendanceTable() {
  const [page, setPage] = useState(1)
  const { rows, totalPages, isLoading, isValidating } = useAttendancePage(page)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee attendance</CardTitle>
        <CardDescription>This month, newest first.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Clock in</TableHead>
              <TableHead>Clock out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AttendanceRows rows={rows} loading={isLoading} />
          </TableBody>
        </Table>
        <TablePagination
          page={page}
          totalPages={totalPages}
          disabled={isValidating}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  )
}
