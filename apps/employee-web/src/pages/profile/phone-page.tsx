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
import type { Profile } from '@/lib/profile'
import { useProfile } from '@/hooks/use-profile'

const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, 'Enter 8–15 digits, optionally starting with +'),
})

type PhoneValues = z.infer<typeof phoneSchema>

export function PhonePage() {
  const { profile, setProfile } = useProfile()
  const navigate = useNavigate()
  const form = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: profile.phone },
  })

  async function onSubmit(values: PhoneValues) {
    try {
      const { data } = await api.patch<Profile>('/profile/me/phone', values)
      setProfile(data)
      toast.success('Phone updated')
      navigate('/profile')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card>
      <SubPageHeader title="Edit phone" />
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FormInput
              control={form.control}
              name="phone"
              label="Phone number"
              type="tel"
              autoComplete="tel"
              autoFocus
            />
            <Button type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving…' : 'Save phone'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
