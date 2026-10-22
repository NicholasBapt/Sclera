import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/mainLayout'
import { Employees } from '../pages/Employees'
import { NotFound } from '../pages/NotFound'
import { Dashboard } from '../pages/Dashboard'
import { Contratos } from '../pages/Contratos'
import { Login } from '../pages/Login'
import AuthLayout from '../layouts/AuthLayout'

export const router = createBrowserRouter([
  { element: <AuthLayout />, children: [{ path: '/login', element: <Login /> }] },
  { path: '/', element: <MainLayout />, children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'employees', element: <Employees /> },
    { path: 'contratos', element: <Contratos /> },
  ]},
  { path: '*', element: <NotFound /> },
])
