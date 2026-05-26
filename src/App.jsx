import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import PanelTecnicoPage from './pages/PanelTecnicoPage'
import PanelClientePage from './pages/PanelClientePage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<LoginPage />} />

        {/* Protegidas por rol */}
        <Route
          path="/tecnico"
          element={
            <PrivateRoute rol="tecnico">
              <PanelTecnicoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <PrivateRoute rol="cliente">
              <PanelClientePage />
            </PrivateRoute>
          }
        />

        {/* Cualquier ruta no encontrada → login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
