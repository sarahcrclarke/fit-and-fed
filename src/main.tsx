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
    {/* BASE_URL keeps routing correct when the app is served from a subpath. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ProfileProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ProfileProvider>
    </BrowserRouter>
  </StrictMode>,
)

registerServiceWorker()
