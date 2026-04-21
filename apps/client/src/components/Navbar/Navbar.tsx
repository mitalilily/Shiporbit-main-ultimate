import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiBell,
  FiDownload,
  FiHeadphones,
  FiPhoneCall,
  FiTruck,
} from 'react-icons/fi'
import { FaWallet } from 'react-icons/fa'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { useAuth } from '../../context/auth/AuthContext'
import { useWalletBalance } from '../../hooks/useWalletBalance'
import FullTruckLoadDialog from './FullTruckLoadDialog'
import UserMenu from './UserMenu'

interface NavbarProps {
  handleDrawerToggle: () => void
  collapsed: boolean
}

const ticketGlyph =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFUSURBVHgB7ZbhbcIwEIVfKwbIBrkNygZ1N+gGZIO2E5ANygYdId2AblB1gqQTABOArdiKA+cEOcaA5E96Mj8u3Mv5zg6QSCQScSGptdQ+kmqpV5eZr4hGjDYm+QynlVF8SH2DR2jTjdQL/CG0u5BJ5VL/M0fgVifjaBy/J/OIG8Jl5hndll0CtTXFWFCFfnMtmRiBbhJ8WKBtWjtPxgWSVIn+eC8DmhHoT9EKZ1QI2hTnXEwwU+tnKziqMYSp0HsAM3N0L0dcwNg0/en1CdMhvf7AcSSMmcn1ukM45vCA0JXVvj8E/LZJ9YiZosW5D5FOXjuSCvg3cIn+lA5W6ROntyoFNKOomBwsZnpUOUvw4ycwzYyikPq1DOUYMFMM/JEIYEZBx2bu4qK8CsffM1u9vsE9fpm1ruGP3Y/sOaaO/X1krUzyB8YQoW3SGDRor4dE4v45ACc5teRehvq0AAAAAElFTkSuQmCC'

export default function Navbar({ handleDrawerToggle }: NavbarProps) {
  const navigate = useNavigate()
  const { walletBalance } = useAuth()
  const { data } = useWalletBalance(true)

  const [helplineOpen, setHelplineOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [fullTruckLoadOpen, setFullTruckLoadOpen] = useState(false)

  const helplineRef = useRef<HTMLDivElement | null>(null)
  const notificationMenuRef = useRef<HTMLLIElement | null>(null)

  const liveBalance = useMemo(() => {
    const value =
      typeof data === 'number'
        ? data
        : Number((data as { data?: { balance?: number } } | undefined)?.data?.balance)
    return Number.isFinite(value) ? value : walletBalance ?? 0
  }, [data, walletBalance])

  const formattedBalance = Number.isFinite(liveBalance) ? liveBalance.toFixed(2) : '0.00'

  useEffect(() => {
    const handleOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) return

      if (helplineRef.current && !helplineRef.current.contains(target)) {
        setHelplineOpen(false)
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(target)) {
        setNotificationOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHelplineOpen(false)
        setNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsidePointerDown)
    document.addEventListener('touchstart', handleOutsidePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsidePointerDown)
      document.removeEventListener('touchstart', handleOutsidePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="header___nav">
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-md-12 h-100 p-0 thenavbarwidhts10">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div className="container-fluid p-0">
                <div className="nav-left-controls">
                  <button type="button" onClick={handleDrawerToggle} className="sidebar-responsive">
                    <HiOutlineMenuAlt3 />
                  </button>

                  <div className={`dropdown ${helplineOpen ? 'open' : ''}`} ref={helplineRef}>
                    <button
                      className="helpline-btn dropdown-toggle"
                      type="button"
                      aria-expanded={helplineOpen}
                      onClick={() => {
                        setHelplineOpen((value) => !value)
                        setNotificationOpen(false)
                      }}
                    >
                      <h3>
                        <FiHeadphones size={22} />
                        <span>Helpline</span>
                      </h3>
                    </button>

                    {helplineOpen ? (
                      <ul className="dropdown-menu customer-dropdown">
                        <li>
                          <div className="helpline-box">
                            <img src="/logo/shiporbit-mark.svg" height={32} className="mb-2" alt="fav" />
                            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                              Customer Support
                            </h2>
                            <p style={{ fontSize: '14px', fontWeight: 400, marginBottom: '14px' }}>
                              For urgent shipment issues or operational support, contact the ParcelX Helpline.
                              Timings: Mon-Sat | 10:30 AM - 6:30 PM
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
                    <div className="wallet__cash s__0144114414 full__trockk">
                      <button
                        type="button"
                        className="navbar-chip-button ftl-trigger-button"
                        aria-label="Open full truck load enquiry form"
                        onClick={() => setFullTruckLoadOpen(true)}
                      >
                        <h3>
                          <span className="s__114414">
                            <FiTruck size={22} />
                          </span>
                          <span>Full Truck Load</span>
                        </h3>
                      </button>
                    </div>

                    <span className="dividerline">|</span>

                    <div className="wallet__cash s__0144114414 loa__dedd">
                      <button
                        type="button"
                        className="navbar-chip-button"
                        aria-label="Open tickets"
                        onClick={() => navigate('/support/tickets')}
                      >
                        <h3>
                          <span className="s__114414">
                            <img src={ticketGlyph} className="Apparrow" alt="logo" width={18} />
                          </span>
                          <span>Tickets</span>
                        </h3>
                      </button>
                    </div>

                  </div>

                  <div className="side__menuusd notification-card">
                    <ul className="nav">
                      <li className="nav-item wallet-nav-item">
                        <div className="wallet__cash therechareapps wallet-corner-card">
                          <h3>
                            <span className="s__114414 wallet-badge-icon">
                              <FaWallet size={15} />
                            </span>
                            <span className="d-responsive">Wallet</span>
                            <span className="s__4774747">{'\u20B9'} {formattedBalance}</span>
                          </h3>
                          <span className="s__114414">
                            <Link to="/wallet/addmoney">
                              Recharge <span className="d-responsive ms-1">Wallet</span>
                            </Link>
                          </span>
                        </div>
                      </li>

                      <li className="s11777 nav-s11777 nav-item" ref={notificationMenuRef}>
                        <button
                          type="button"
                          aria-label="Notifications"
                          aria-expanded={notificationOpen}
                          onClick={(event) => {
                            event.stopPropagation()
                            setNotificationOpen((value) => !value)
                            setHelplineOpen(false)
                          }}
                        >
                          <span className="iocns__00 c__114411 notification-wrapper">
                            <FiBell size={18} />
                          </span>
                        </button>

                        {notificationOpen ? (
                          <div className="chakra-menu__menu-list profile-menu notification-popover">
                            <div className="profile-menu-header">
                              <strong>0 New Notifications</strong>
                            </div>
                            <button type="button">No notifications available</button>
                          </div>
                        ) : null}
                      </li>

                      <li className="s11777 nav-item">
                        <button type="button" aria-label="Downloads">
                          <span className="iocns__00 c__114411">
                            <FiDownload size={18} />
                          </span>
                        </button>
                      </li>

                      <li className="s11777 nav-item">
                        <button type="button" aria-label="Support" onClick={() => navigate('/support/tickets')}>
                          <span className="iocns__00 c__114411">
                            <FiHeadphones size={18} />
                          </span>
                        </button>
                      </li>

                      <li className="s_user_09 position-relative nav-item">
                        <UserMenu />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <FullTruckLoadDialog open={fullTruckLoadOpen} onClose={() => setFullTruckLoadOpen(false)} />
    </div>
  )
}
