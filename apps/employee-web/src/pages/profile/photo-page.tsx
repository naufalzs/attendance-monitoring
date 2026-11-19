import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { SubPageHeader } from '@/components/sub-page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { api, getErrorMessage } from '@/lib/api'
import type { Profile } from '@/lib/profile'
import { ProfileAvatar } from './profile-avatar'
import { useProfile } from './use-profile'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const photoSchema = z.object({
  photo: z
    .instanceof(File, { message: 'Choose a photo' })
    .refine((file) => PHOTO_TYPES.includes(file.type), 'Use a JPG, PNG or WebP image')
    .refine((file) => file.size <= MAX_PHOTO_BYTES, 'Photo must be 2 MB or smaller'),
})

type PhotoValues = z.infer<typeof photoSchema>

export function PhotoPage() {
  const { profile, setProfile } = useProfile()
  const navigate = useNavigate()
  const form = useForm<PhotoValues>({ resolver: zodResolver(photoSchema) })
  const selected = useWatch({ control: form.control, name: 'photo' })
  const preview = useMemo(
    () =>
      selected instanceof File && PHOTO_TYPES.includes(selected.type)
        ? URL.createObjectURL(selected)
        : undefined,
    [selected],
  )

  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  async function onSubmit({ photo }: PhotoValues) {
    const body = new FormData()
    body.append('photo', photo)
    try {
      const { data } = await api.patch<Profile>('/profile/me/photo', body)
      setProfile(data)
      toast.success('Photo updated')
      navigate('/profile')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card>
      <SubPageHeader title="Change photo" />
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <ProfileAvatar profile={profile} src={preview} className="size-28 self-center" />
            <Controller
              name="photo"
              control={form.control}
              render={({ field: { onChange, onBlur, name, ref }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="photo">New photo</FieldLabel>
                  <Input
                    id="photo"
                    type="file"
                    className="h-auto cursor-pointer border-dashed py-2 transition-colors file:cursor-pointer hover:border-primary hover:bg-accent"
                    accept={PHOTO_TYPES.join(',')}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.files?.[0])}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>JPG, PNG or WebP, up to 2 MB.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Uploading…' : 'Upload photo'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
