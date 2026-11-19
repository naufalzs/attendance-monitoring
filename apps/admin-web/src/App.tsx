import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '@/components/app-layout'
import { RequireAuth } from '@/components/require-auth'
import { Toaster } from '@/components/ui/sonner'
import { EmployeeCreatePage } from '@/pages/employees/employee-create-page'
import { EmployeeListPage } from '@/pages/employees/employee-list-page'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees">
              <Route index element={<EmployeeListPage />} />
              <Route path="new" element={<EmployeeCreatePage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
