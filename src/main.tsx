import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginScreen from './components/LoginPage'
import SignupScreen from './components/SignupPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginScreen />
  </StrictMode>,
)
