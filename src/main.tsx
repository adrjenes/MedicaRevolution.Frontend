import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/routes'
import { ToastContainer, toastConfig } from './toastConfig';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <AppRoutes />
     <ToastContainer {...toastConfig} />
  </React.StrictMode>,
)
