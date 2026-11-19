import { ChevronDownIcon, KeyRoundIcon, LogOutIcon, UserRoundIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AccountMenu({ name, onLogout }: { name: string; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Account menu">
          <UserRoundIcon />
          <span className="hidden max-w-32 truncate sm:inline">{name}</span>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-md p-0">
        <DropdownMenuLabel className="truncate px-3 py-1.5">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0 my-0" />
        <DropdownMenuItem asChild className="cursor-pointer rounded-none px-3 py-2">
          <Link to="/profile/password">
            <KeyRoundIcon />
            Change password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer rounded-none px-3 py-2"
          onSelect={onLogout}
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
