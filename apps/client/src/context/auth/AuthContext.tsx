import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { logoutApi } from '../../api/auth'
import { clearAuthTokens, getAuthTokens, setAuthTokens } from '../../api/tokenVault'
import { resetDemoUserProfile } from '../../api/userProfile.api'
import { useUserProfile } from '../../hooks/User/useUserProfile'
import type { IUserProfileDB } from '../../types/user.types'
import { emptyUserProfile } from '../../utils/utility'

/* ---------- context shape ---------- */
interface AuthCtx {
  setUserId: Dispatch<SetStateAction<string>>
  userId: string
  user: IUserProfileDB
  loading: boolean
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  clearTokens: () => void
  logout: () => Promise<void>
  refetchUser: () => void
  walletBalance: number | null
  setWalletBalance: Dispatch<SetStateAction<number | null>>
}

export const AuthContext = createContext<AuthCtx | undefined>(undefined)

/* ---------- provider ---------- */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const { accessToken, refreshToken } = getAuthTokens()
  const hasTokens = !!accessToken && !!refreshToken

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [userId, setUserId] = useState('demo-user')

  const {
    data: user,
    isFetching: userFetching,
    refetch: refetchUser,
  } = useUserProfile(isAuthenticated)

  useEffect(() => {
    if (user?.id) setUserId(user.id)
  }, [user])

  useEffect(() => {
    if (!hasTokens) {
      resetDemoUserProfile()
    }
  }, [hasTokens])

  const setTokens = (access: string, refresh: string) => {
    setAuthTokens(access, refresh)
    setIsAuthenticated(true)
    refetchUser()
  }

  const clearTokens = () => {
    clearAuthTokens()
    setIsAuthenticated(true)
    setUserId('demo-user')
    queryClient.removeQueries({ queryKey: ['userInfo'] })
    queryClient.removeQueries({ queryKey: ['userProfile'] })
    queryClient.removeQueries({ queryKey: ['walletBalance'] })
    resetDemoUserProfile()
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (e) {
      console.error('Logout error ignored:', e)
    }
    clearTokens()
    window.location.replace('/#/dashboard')
  }

  const value: AuthCtx = {
    user: user ?? { ...emptyUserProfile },
    loading: userFetching,
    isAuthenticated,
    setUserId,
    setTokens,
    clearTokens,
    userId,
    logout,
    refetchUser,
    walletBalance,
    setWalletBalance,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ---------- hook ---------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
