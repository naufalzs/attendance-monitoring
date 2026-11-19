import { Link, NavLink } from 'react-router'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/profile', label: 'Profile' },
  { to: '/summary', label: 'Summary' },
]

export function MainNav() {
  return (
    <nav className="flex items-center gap-1">
      <Link to="/profile" className="mr-3 font-semibold text-primary">
        Attendance
      </Link>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground',
              isActive && 'bg-accent text-accent-foreground',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
