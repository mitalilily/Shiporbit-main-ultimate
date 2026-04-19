import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiBell, FiDownload, FiHeadphones, FiPhoneCall, FiTruck } from 'react-icons/fi'
import {
  FiCheckCircle,
  FiFileText,
  FiHome,
  FiLifeBuoy,
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi'
import { HiChevronDown } from 'react-icons/hi'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
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
  const [helplineOpen, setHelplineOpen] = useState(false)
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
  ] as any

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
                    <Link className="top-navbar-logo" to="/dashboard" aria-label="ShipOrbit dashboard">
                      <img src={SHIPORBIT_LOGO} alt="ShipOrbit logo" />
                    </Link>
                    <button type="button" onClick={handleDrawerToggle} className="sidebar-responsive">
                      <HiOutlineMenuAlt3 />
                    </button>
                    <div className={`dropdown ${helplineOpen ? 'open' : ''}`}>
                      <button
                        className="helpline-btn dropdown-toggle"
                        type="button"
                        onClick={() => setHelplineOpen((value) => !value)}
                      >
                        <h3>
                          <FiHeadphones size={22} />
                          <span>ShipOrbit Help</span>
                        </h3>
                      </button>
                      {helplineOpen ? (
                        <ul className="dropdown-menu customer-dropdown">
                          <li>
                            <div className="helpline-box">
                              <FiPhoneCall size={32} className="mb-2" />
                              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                                ShipOrbit Support
                              </h2>
                              <p style={{ fontSize: '14px', fontWeight: 400, marginBottom: '14px' }}>
                                For urgent shipment issues or operational support, contact the ShipOrbit
                                helpline. Timings: Mon-Sat | 10:30 AM - 6:30 PM
                              </p>
                              <a href="tel:9311936818">
                                <FiPhoneCall /> 9311936818
                              </a>
                            </div>
                          </li>
                        </ul>
                      ) : null}
                    </div>
                  </div>

                  <div className="s__llii0099 ms-auto">
                    <div className="nav-flex">
                      <div className="wallet__cash s__0144114414 full__trockk" role="button" tabIndex={0}>
                        <h3>
                          <span className="s__114414">
                            <FiTruck size={22} />
                          </span>
                          <span>Full Truck Load</span>
                        </h3>
                      </div>
                      <div
                        className="wallet__cash s__0144114414 loa__dedd"
                        onClick={() => navigate('/support/tickets')}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3>
                          <span className="s__114414">
                            <TbTicket size={18} />
                          </span>
                          <span>Tickets</span>
                        </h3>
                      </div>
                      <div className="wallet__cash therechareapps" onClick={() => setWalletDialogOpen(true)}>
                        <h3>
                          ShipOrbit <span className="d-responsive ms-1">Wallet</span> :{' '}
                          <span className="s__4774747">₹ {liveBalance.toFixed(2)}</span>
                        </h3>
                        <span className="s__114414">
                          <Link to="/wallet/addmoney" onClick={(event) => event.preventDefault()}>
                            Recharge <span className="d-responsive ms-1">Wallet</span>
                          </Link>
                        </span>
                      </div>
                    </div>

                    <div className="side__menuusd notification-card">
                      <ul className="nav">
                        <li className="s11777 nav-s11777">
                          <button type="button" aria-label="Notifications">
                            <span className="iocns__00 c__114411 notification-wrapper">
                              <FiBell />
                            </span>
                          </button>
                        </li>
                        <li className="s11777">
                          <button type="button" aria-label="Downloads">
                            <span className="iocns__00 c__114411">
                              <FiDownload />
                            </span>
                          </button>
                        </li>
                        <li className="s11777">
                          <button type="button" aria-label="Support" onClick={() => navigate('/support')}>
                            <span className="iocns__00 c__114411">
                              <FiHeadphones />
                            </span>
                          </button>
                        </li>
                        <li className="s_user_09 position-relative" ref={profileMenuRef}>
                          <button
                            type="button"
                            className="profile__0244"
                            aria-expanded={profileOpen}
                            aria-haspopup="menu"
                            onClick={(event) => {
                              event.stopPropagation()
                              setProfileOpen((value) => !value)
                            }}
                          >
                            <span className="profiledropdown">
                              <span className="userprofile_0">{initials}</span>
                              <span>
                                <HiChevronDown className="drop012" />
                              </span>
                            </span>
                          </button>
                          {profileOpen ? (
                            <div className="chakra-menu__menu-list profile-menu" onClick={(event) => event.stopPropagation()}>
                              <div className="profile-menu-header">
                                <strong>{resolvedFullName || 'ShipOrbit User'}</strong>
                                <p>{email}</p>
                              </div>
                              {profileActions.map((item) => (
                                <button
                                  key={item.label}
                                  type="button"
                                  className={`chakra-menu__menuitem profile-settings${item.danger ? ' logout-button' : ''}`}
                                  onClick={() => {
                                    setProfileOpen(false)
                                    item.onClick()
                                  }}
                                >
                                  <p className="chakra-text css-197xc22">
                                    <span style={{ marginLeft: 8 }}>{item.label}</span>
                                    <span aria-hidden="true">{item.icon}</span>
                                  </p>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <AddMoneyDialog currentBalance={liveBalance} open={walletDialogOpen} setOpen={setWalletDialogOpen} />
    </>
  )
}  