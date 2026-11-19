import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { FormInput } from '@/components/form-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { api, getErrorMessage } from '@/lib/api'
import { getToken, setToken } from '@/lib/auth'

const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from: string = location.state?.from?.pathname ?? '/'
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (getToken()) return <Navigate to={from} replace />

  async function onSubmit(values: LoginValues) {
    try {
      const { data } = await api.post<{ accessToken: string }>('/auth/login', values)
      setToken(data.accessToken)
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Employee login</CardTitle>
          <CardDescription>Sign in with your company email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
              />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
