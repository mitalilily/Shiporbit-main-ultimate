import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { loginWithEmailOnlyApi, logoutApi } from '../../api/auth'
import { clearAuthTokens, getAuthTokens, setAuthTokens } from '../../api/tokenVault'
import { useUserProfile } from '../../hooks/User/useUserProfile'
import type { IUserProfileDB } from '../../types/user.types'
import { emptyUserProfile } from '../../utils/utility'

const TEST_ACCESS_EMAIL = 'test@shiporbit.local'

const shouldAttemptAutoLogin = () => {
  if (typeof window === 'undefined') return false

  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0'
}

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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasTokens)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [userId, setUserId] = useState('')
  const [bootstrappingAuth, setBootstrappingAuth] = useState<boolean>(!hasTokens)
  const autoLoginAttempted = useRef(false)

  const {
    data: user,
    isFetching: userFetching,
    refetch: refetchUser,
  } = useUserProfile(isAuthenticated)

  useEffect(() => {
    // If we successfully fetched a user, ensure auth is marked as true.
    if (user?.id) {
      setIsAuthenticated(true)
      setBootstrappingAuth(false)
    }
    // Do NOT automatically mark user as unauthenticated on generic errors here.
    // Auth state should primarily follow presence of valid tokens; 401 handling
    // is done in axios interceptors which clear tokens and redirect as needed.
  }, [user])

  useEffect(() => {
    if (hasTokens) {
      setBootstrappingAuth(false)
      return
    }

    if (autoLoginAttempted.current || !shouldAttemptAutoLogin()) {
      setBootstrappingAuth(false)
      return
    }
    autoLoginAttempted.current = true

    const autoLogin = async () => {
      try {
        const { token, refreshToken, user } = await loginWithEmailOnlyApi(TEST_ACCESS_EMAIL)
        setAuthTokens(token, refreshToken)
        setUserId(user?.id ?? '')
        setIsAuthenticated(true)
        refetchUser()
      } catch (error) {
        console.error('Test auto-login failed:', error)
        clearAuthTokens()
        setIsAuthenticated(false)
      } finally {
        setBootstrappingAuth(false)
      }
    }

    void autoLogin()
  }, [hasTokens, refetchUser])

  const setTokens = (access: string, refresh: string) => {
    setAuthTokens(access, refresh)
    setIsAuthenticated(true)
    refetchUser()
  }

  const clearTokens = () => {
    clearAuthTokens()
    setIsAuthenticated(false)
    queryClient.removeQueries({ queryKey: ['userInfo'] })
    queryClient.removeQueries({ queryKey: ['userProfile'] })
    queryClient.removeQueries({ queryKey: ['walletBalance'] })
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (e) {
      console.error('Logout error ignored:', e)
    }
    clearTokens()
    window.location.href = '/login'
  }

  const value: AuthCtx = {
    user: user ?? { ...emptyUserProfile },
    loading: bootstrappingAuth || userFetching,
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
