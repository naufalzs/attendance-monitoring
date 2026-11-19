import { SearchIcon } from 'lucide-react'
import { useSearchParams } from 'react-router'
import useSWR from 'swr'
import { EmployeeTable } from '@/components/employees/employee-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Employee } from '@/lib/employees'

export function EmployeeListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { data = [], isLoading } = useSWR<Employee[]>('/employees')

  const needle = query.trim().toLowerCase()
  const employees = needle
    ? data.filter((employee) =>
        [employee.name, employee.email, employee.position, employee.phone].some((value) =>
          value.toLowerCase().includes(needle),
        ),
      )
    : data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name, email, position or phone"
            aria-label="Search employees"
            className="pl-8"
            value={query}
            onChange={(event) =>
              setSearchParams(event.target.value ? { q: event.target.value } : {}, {
                replace: true,
              })
            }
          />
        </div>
        <EmployeeTable
          employees={employees}
          loading={isLoading}
          emptyMessage={needle ? `No employees match "${query.trim()}".` : 'No employees yet.'}
        />
      </CardContent>
    </Card>
  )
}
