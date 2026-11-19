import { PencilIcon } from 'lucide-react'
import { Link } from 'react-router'
import { DeleteEmployeeButton } from '@/components/employees/delete-employee-button'
import { Button } from '@/components/ui/button'
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

const COLUMNS = ['Name', 'Email', 'Position', 'Phone number']

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
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
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
              <TableCell>
                <Skeleton className="h-6 w-14" />
              </TableCell>
            </TableRow>
          ))
        ) : employees.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={COLUMNS.length + 1}
              className="py-8 text-center text-muted-foreground"
            >
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
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-xs" asChild>
                    <Link to={employee.id} aria-label={`Edit ${employee.name}`} title="Edit">
                      <PencilIcon />
                    </Link>
                  </Button>
                  <DeleteEmployeeButton employee={employee} />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
