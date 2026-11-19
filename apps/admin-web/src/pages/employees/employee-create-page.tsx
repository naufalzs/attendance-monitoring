import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { type EmployeeValues, EmployeeForm } from '@/components/employees/employee-form'
import { SubPageHeader } from '@/components/sub-page-header'
import { Card, CardContent } from '@/components/ui/card'
import { api, getErrorMessage } from '@/lib/api'

export function EmployeeCreatePage() {
  const navigate = useNavigate()

  async function create(values: EmployeeValues) {
    try {
      await api.post('/employees', values)
      await mutate('/employees')
      toast.success(`${values.name} added`)
      navigate('/employees')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card>
      <SubPageHeader title="Add employee" backTo="/employees" />
      <CardContent>
        <EmployeeForm submitLabel="Add employee" onSubmit={create} />
      </CardContent>
    </Card>
  )
}
