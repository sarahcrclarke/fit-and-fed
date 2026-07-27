import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ProfileProvider } from './context/ProfileContext'
import { DataProvider } from './data/store'
import { registerServiceWorker } from './pwa/registerServiceWorker'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProfileProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ProfileProvider>
    </BrowserRouter>
  </StrictMode>,
)

registerServiceWorker()
