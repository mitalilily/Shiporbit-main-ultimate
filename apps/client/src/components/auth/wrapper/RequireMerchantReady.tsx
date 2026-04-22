import type { ReactNode } from 'react'
import FullScreenLoader from '../../UI/loader/FullScreenLoader'

export default function RequireMerchantReady({ children }: { children: ReactNode }) {
  const isLoading = false
  if (isLoading) return <FullScreenLoader />
  return <>{children}</>
}
