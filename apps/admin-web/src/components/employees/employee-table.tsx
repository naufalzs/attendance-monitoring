import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Employee } from '@/lib/employees'

const COLUMNS = ['Name', 'Email', 'Position', 'Phone']

export function EmployeeTable({
  employees,
  loading,
  emptyMessage,
}: {
  employees: Employee[]
  loading: boolean
  emptyMessage: string
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {COLUMNS.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }, (_, index) => (
            <TableRow key={index}>
              {COLUMNS.map((column) => (
                <TableCell key={column}>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={COLUMNS.length} className="py-8 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          employees.map((employee) => (
            <TableRow key={employee.id} className="even:bg-muted hover:bg-accent">
              <TableCell className="font-medium">
                {employee.name}
                {employee.role === 'ADMIN' && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">Admin</span>
                )}
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell className="tabular-nums">{employee.phone}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
