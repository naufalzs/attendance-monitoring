import { Navigate, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'
import { type EmployeeValues, EmployeeForm } from '@/components/employees/employee-form'
import { SubPageHeader } from '@/components/sub-page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api, getErrorMessage } from '@/lib/api'
import type { Employee } from '@/lib/employees'

export function EmployeeEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: employee, error } = useSWR<Employee>(`/employees/${id}`)

  if (error) return <Navigate to="/employees" replace />

  async function update({ password, ...details }: EmployeeValues) {
    try {
      const { data } = await api.patch<Employee>(
        `/employees/${id}`,
        password ? { ...details, password } : details,
      )
      await mutate(`/employees/${id}`, data, { revalidate: false })
      await mutate('/employees')
      toast.success(`${data.name} updated`)
      navigate('/employees')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card>
      <SubPageHeader title="Edit employee" backTo="/employees" />
      <CardContent>
        {employee ? (
          <EmployeeForm employee={employee} submitLabel="Save changes" onSubmit={update} />
        ) : (
          <div className="grid gap-5">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
