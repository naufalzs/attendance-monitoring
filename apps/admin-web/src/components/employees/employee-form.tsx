import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormInput } from '@/components/form-input'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import type { Employee } from '@/lib/employees'

const PASSWORD_MESSAGE = 'Password must be at least 8 characters'

const detailsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email'),
  position: z.string().trim().min(1, 'Position is required'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, 'Enter 8–15 digits, optionally starting with +'),
})

const createSchema = detailsSchema.extend({ password: z.string().min(8, PASSWORD_MESSAGE) })

const editSchema = detailsSchema.extend({
  password: z.string().refine((value) => value === '' || value.length >= 8, PASSWORD_MESSAGE),
})

export type EmployeeValues = z.infer<typeof createSchema>

export function EmployeeForm({
  employee,
  submitLabel,
  onSubmit,
}: {
  employee?: Employee
  submitLabel: string
  onSubmit: (values: EmployeeValues) => Promise<void>
}) {
  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employee ? editSchema : createSchema),
    defaultValues: {
      name: employee?.name ?? '',
      email: employee?.email ?? '',
      position: employee?.position ?? '',
      phone: employee?.phone ?? '',
      password: '',
    },
  })
  const { isDirty, isSubmitting } = form.formState

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormInput control={form.control} name="name" label="Name" autoComplete="off" />
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="off"
        />
        <FormInput control={form.control} name="position" label="Position" autoComplete="off" />
        <FormInput
          control={form.control}
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="off"
        />
        <FormInput
          control={form.control}
          name="password"
          label={employee ? 'New password (leave blank to keep current)' : 'Password'}
          type="password"
          autoComplete="new-password"
        />
        <Button type="submit" disabled={isSubmitting || (employee && !isDirty)}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
