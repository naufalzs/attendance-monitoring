import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { FormInput } from '@/components/form-input'
import { SubPageHeader } from '@/components/sub-page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { api, getErrorMessage } from '@/lib/api'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type PasswordValues = z.infer<typeof passwordSchema>

const fields = [
  { name: 'currentPassword', label: 'Current password', autoComplete: 'current-password' },
  { name: 'newPassword', label: 'New password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirm new password', autoComplete: 'new-password' },
] as const

export function PasswordPage() {
  const navigate = useNavigate()
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function onSubmit({ currentPassword, newPassword }: PasswordValues) {
    try {
      await api.patch('/profile/me/password', { currentPassword, newPassword })
      toast.success('Password changed')
      navigate('/profile')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card>
      <SubPageHeader title="Change password" />
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            {fields.map((field) => (
              <FormInput key={field.name} control={form.control} type="password" {...field} />
            ))}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving…' : 'Change password'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
