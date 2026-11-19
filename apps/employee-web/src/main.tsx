import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'
import './index.css'
import App from './App.tsx'
import { fetcher, getErrorMessage } from '@/lib/api'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SWRConfig
      value={{
        fetcher,
        shouldRetryOnError: false,
        onError: (error) => toast.error(getErrorMessage(error)),
      }}
    >
      <App />
    </SWRConfig>
  </StrictMode>,
)
