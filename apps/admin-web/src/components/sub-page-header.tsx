import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { CardAction, CardHeader, CardTitle } from '@/components/ui/card'

export function SubPageHeader({ title, backTo }: { title: string; backTo: string }) {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardAction>
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <Link to={backTo}>Cancel</Link>
        </Button>
      </CardAction>
    </CardHeader>
  )
}
