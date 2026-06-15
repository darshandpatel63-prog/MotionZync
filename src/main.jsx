// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from './context/AuthContext.jsx'
import { AIProviderContext } from './ai/providers/AIProviderContext.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <AIProviderContext>
          <App/>
        </AIProviderContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)
