import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormInput } from '@/components/form-input'
import { Button } from '@/components/ui/button'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const filterSchema = z
  .object({
    from: z.string().regex(DATE_PATTERN, 'Pick a start date'),
    to: z.string().regex(DATE_PATTERN, 'Pick an end date'),
  })
  .refine((values) => values.from <= values.to, {
    path: ['to'],
    message: 'End date must be on or after the start date',
  })

export type AttendanceFilter = z.infer<typeof filterSchema>

export function AttendanceFilterForm({
  value,
  searching,
  onSearch,
}: {
  value: AttendanceFilter
  searching: boolean
  onSearch: (filter: AttendanceFilter) => void
}) {
  const form = useForm<AttendanceFilter>({
    resolver: zodResolver(filterSchema),
    values: value,
  })

  return (
    <form
      onSubmit={form.handleSubmit(onSearch)}
      noValidate
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
    >
      <FormInput control={form.control} name="from" label="From" type="date" />
      <FormInput control={form.control} name="to" label="To" type="date" />
      <Button type="submit" className="sm:mt-6.5" disabled={searching}>
        {searching ? 'Searching…' : 'Search'}
      </Button>
    </form>
  )
}
