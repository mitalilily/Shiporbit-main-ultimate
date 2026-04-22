import { Navigate } from 'react-router-dom'
import FullScreenLoader from '../components/UI/loader/FullScreenLoader'
import { useAuth } from '../context/auth/AuthContext'

export default function AppEntry() {
  const { loading } = useAuth()

  if (loading) return <FullScreenLoader />
  return <Navigate to="/dashboard" replace />
}
