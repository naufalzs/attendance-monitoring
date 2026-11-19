import { Button } from '@/components/ui/button'

export function TablePagination({
  page,
  totalPages,
  disabled,
  onPageChange,
}: {
  page: number
  totalPages: number
  disabled: boolean
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
