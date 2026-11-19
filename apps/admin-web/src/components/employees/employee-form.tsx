import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormInput } from '@/components/form-input'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'

const employeeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email'),
  position: z.string().trim().min(1, 'Position is required'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, 'Enter 8–15 digits, optionally starting with +'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type EmployeeValues = z.infer<typeof employeeSchema>

const EMPTY: EmployeeValues = { name: '', email: '', position: '', phone: '', password: '' }

export function EmployeeForm({
  submitLabel,
  onSubmit,
}: {
  submitLabel: string
  onSubmit: (values: EmployeeValues) => Promise<void>
}) {
  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: EMPTY,
  })

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
          label="Password"
          type="password"
          autoComplete="new-password"
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
