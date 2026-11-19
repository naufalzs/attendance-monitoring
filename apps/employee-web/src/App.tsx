import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '@/components/app-layout'
import { RequireAuth } from '@/components/require-auth'
import { Toaster } from '@/components/ui/sonner'
import { LoginPage } from '@/pages/login-page'
import { PasswordPage } from '@/pages/profile/password-page'
import { PhonePage } from '@/pages/profile/phone-page'
import { PhotoPage } from '@/pages/profile/photo-page'
import { ProfileLayout } from '@/pages/profile/profile-layout'
import { ProfilePage } from '@/pages/profile/profile-page'
import { SummaryPage } from '@/pages/summary-page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<ProfilePage />} />
              <Route path="photo" element={<PhotoPage />} />
              <Route path="phone" element={<PhonePage />} />
              <Route path="password" element={<PasswordPage />} />
            </Route>
            <Route path="/summary" element={<SummaryPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
