import { Navigate, Outlet, useLocation } from 'react-router'
import { getToken } from '@/lib/auth'

export function RequireAuth() {
  const location = useLocation()
  if (!getToken()) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
