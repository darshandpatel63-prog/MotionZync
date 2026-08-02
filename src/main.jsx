// src/main.jsx 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { VaultProvider } from './ai/providers/VaultContext.jsx'
import { AIProviderContext } from './ai/providers/AIProviderContext.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VaultProvider>
          <AIProviderContext>
            <App />
          </AIProviderContext>
        </VaultProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
