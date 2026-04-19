import type { JSX } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiBell,
  FiDownload,
  FiHeadphones,
  FiPhoneCall,
  FiTruck,
  FiCheckCircle,
  FiFileText,
  FiHome,
  FiLifeBuoy,
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi'
import { HiChevronDown, HiOutlineMenuAlt3 } from 'react-icons/hi'
import { TbTicket } from 'react-icons/tb'
import AddMoneyDialog from '../AddMoneyDialog'
import { useAuth } from '../../context/auth/AuthContext'
import { useWalletBalance } from '../../hooks/useWalletBalance'

const SHIPORBIT_LOGO = '/logo/shiporbit-logo.jpeg'

interface NavbarProps {
  handleDrawerToggle: () => void
  collapsed: boolean
}

const getInitials = (value?: string | null) => {
  const safe = (value || '').trim()
  if (!safe) return 'SO'
  const parts = safe.split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'SO'
}

export default function Navbar({ handleDrawerToggle }: NavbarProps) {
  const navigate = useNavigate()
  const { walletBalance, user, logout } = useAuth()
  const { data } = useWalletBalance(true)

  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [_helplineOpen, _setHelplineOpen] = useState(false) // ✅ renamed (unused fix)
  const [profileOpen, setProfileOpen] = useState(false)

  const profileMenuRef = useRef<HTMLLIElement | null>(null)

  const liveBalance = useMemo(() => {
    const value =
      typeof data === 'number'
        ? data
        : Number((data as { data?: { balance?: number } } | undefined)?.data?.balance)
    return Number.isFinite(value) ? value : walletBalance ?? 0
  }, [data, walletBalance])

  const resolvedFullName = user.name || localStorage.getItem('fullname') || ''
  const initials = getInitials(resolvedFullName)
  const email = localStorage.getItem('username') || 'support@shiporbit.com'

  const profileActions = [
    { label: 'Profile Settings', icon: <FiUser size={18} />, onClick: () => navigate('/profile/user_profile') },
    { label: 'DC Address', icon: <FiHome size={18} />, onClick: () => navigate('/settings/manage_pickups') },
    { label: 'KYC', icon: <FiCheckCircle size={18} />, onClick: () => navigate('/profile/kyc_details') },
    { label: 'Change Password', icon: <FiSettings size={18} />, onClick: () => navigate('/profile/password') },
    {
      label: 'Term & Conditions',
      icon: <FiFileText size={18} />,
      onClick: () => navigate('/policies/terms_of_service'),
    },
    { label: 'Support', icon: <FiLifeBuoy size={18} />, onClick: () => navigate('/support/tickets') },
    { label: 'Log out', icon: <FiLogOut size={18} />, onClick: () => void logout(), danger: true },
  ] as Array<{
    label: string
    icon: JSX.Element
    onClick: () => void | Promise<void>
    danger?: boolean
  }>

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (profileMenuRef.current && target && !profileMenuRef.current.contains(target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  return (
    <>
      <div className="header___nav">
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className="col-md-12 h-100 p-0 thenavbarwidhts10">
              <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid p-0">

                  <div className="nav-left-controls">
                    <Link className="top-navbar-logo" to="/dashboard">
                      <img src={SHIPORBIT_LOGO} alt="ShipOrbit logo" />
                    </Link>

                    <button onClick={handleDrawerToggle}>
                      <HiOutlineMenuAlt3 />
                    </button>
                  </div>

                  <div className="ms-auto">
                    <ul>
                      <li ref={profileMenuRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setProfileOpen((v) => !v)
                          }}
                        >
                          {initials} <HiChevronDown />
                        </button>

                        {profileOpen && (
                          <div>
                            <strong>{resolvedFullName || 'User'}</strong>
                            <p>{email}</p>

                            {profileActions.map((item) => (
                              <button
                                key={item.label}
                                className={item.danger ? 'logout-button' : ''}
                                onClick={() => {
                                  setProfileOpen(false)
                                  item.onClick()
                                }}
                              >
                                {item.label} {item.icon}
                              </button>
                            ))}
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>

                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <AddMoneyDialog
        currentBalance={liveBalance}
        open={walletDialogOpen}
        setOpen={setWalletDialogOpen}
      />
    </>
  )
}