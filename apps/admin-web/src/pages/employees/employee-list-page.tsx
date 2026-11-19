import { PlusIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import useSWR from 'swr'
import { EmployeeTable } from '@/components/employees/employee-table'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useDebounce } from '@/hooks/use-debounce'
import type { Employee } from '@/lib/employees'

export function EmployeeListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [search, setSearch] = useState(query)
  const debouncedSearch = useDebounce(search)
  const { data = [], isLoading } = useSWR<Employee[]>('/employees')

  useEffect(() => {
    if (debouncedSearch === query) return
    setSearchParams(debouncedSearch ? { q: debouncedSearch } : {}, { replace: true })
  }, [debouncedSearch, query, setSearchParams])

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
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon-sm" aria-label="Add employee" asChild>
                <Link to="new">
                  <PlusIcon />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add employee</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees"
            aria-label="Search employees"
            className="pl-8"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
