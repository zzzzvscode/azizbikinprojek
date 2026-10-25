import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode sengaja dimatikan: di mode dev, StrictMode me-mount komponen 2x
// sehingga Spline di-dispose saat masih loading dan melempar error (layar blank).
createRoot(document.getElementById('root')).render(<App />)
