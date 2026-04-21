import { CircularProgress, Switch } from '@mui/material'
import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useBillingPreference } from '../../hooks/Billing/useBillingPreferences'
import { useUserProfile } from '../../hooks/User/useUserProfile'

const PROFILE_TABS = [
  { label: 'Account Detail', path: '/my-profile' },
  { label: 'Billing Details', path: '/profiles/billingdetail' },
  { label: 'Login History', path: '/profiles/loginhistory' },
] as const

const SAMPLE_LOGIN_HISTORY = [
  ['2026-04-17 19:53:02', 'New Delhi, India', '203.145.142.86', 'Win10 Chrome 0.0', 'Desktop'],
  ['2026-04-17 13:38:33', 'Surat, India', '103.240.76.67', 'Win10 Chrome 0.0', 'Desktop'],
  ['2026-04-17 13:03:09', 'Surat, India', '103.240.76.67', 'Win10 Firefox 0.0', 'Desktop'],
  ['2026-04-17 09:43:43', 'Mohali, India', '112.196.95.2', 'Win10 Chrome 0.0', 'Desktop'],
  ['2026-04-16 20:55:38', 'Mohali, India', '112.196.95.2', 'Win10 Headless Chrome 0.0', 'Desktop'],
  ['2026-04-16 18:44:30', 'Mohali, India', '112.196.95.2', 'Win10 Chrome 0.0', 'Desktop'],
  ['2026-04-16 18:24:17', 'Surat, India', '103.240.76.67', 'Win10 Chrome 0.0', 'Desktop'],
  ['2026-04-16 14:26:34', 'Surat, India', '103.240.76.67', 'Win10 Chrome 0.0', 'Desktop'],
  ['2026-04-13 17:11:54', 'Surat, India', '103.240.76.67', 'Win10 Chrome 0.0', 'Desktop'],
  ['2026-04-10 12:04:28', 'Surat, India', '103.84.105.49', 'Win10 Chrome 0.0', 'Desktop'],
]

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

const LabelValue = ({ label, value, success = false }: { label: string; value: string; success?: boolean }) => (
  <li>
    <span className="unbold__title profils">{label}</span>
    <span className={`bol___text profilesds ${success ? 'green-text' : ''}`.trim()}>{value}</span>
  </li>
)

const formatBusinessType = (businessType?: string[]) => {
  if (!businessType?.length) return 'ProprietorshipFirm'
  return businessType.map((item) => item.toUpperCase()).join(', ')
}

const formatKycStatus = (status?: string | null) => {
  if (!status) return 'Pending'
  if (status === 'verified') return 'Approved'
  if (status === 'verification_in_progress') return 'Verification In Progress'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function ProfileSettingsCenter() {
  const location = useLocation()
  const { data: profile, isLoading } = useUserProfile(true)
  const { data: billingPreference } = useBillingPreference()

  const activeTab = useMemo(() => {
    if (isPath(location.pathname, '/profiles/billingdetail')) return 'billing'
    if (isPath(location.pathname, '/profiles/loginhistory')) return 'history'
    return 'account'
  }, [location.pathname])

  const companyName = profile?.companyInfo?.brandName || profile?.companyInfo?.businessName || 'PURVI ENTERPRISE'
  const registerName = profile?.companyInfo?.contactPerson || profile?.name || 'purushottam bhuva'
  const registerNumber = profile?.companyInfo?.contactNumber || profile?.companyInfo?.companyContactNumber || '7201897544'
  const registerEmail = profile?.companyInfo?.contactEmail || profile?.email || 'mukeshlagdhir@gmail.com'
  const accountStatus = profile?.approved ? 'Approved' : 'Pending'
  const kycStatus = formatKycStatus(profile?.domesticKyc?.status)
  const businessLabel = formatBusinessType(profile?.businessType)
  const categoryLabel = profile?.companyInfo?.website ? 'Website' : 'D2C'
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}`

  const accountFieldsLeft = [
    ['Register Name', registerName],
    ['Registered Number', registerNumber],
    ['Registered Email', registerEmail],
    ['Alt. Contact', '-'],
  ]

  const accountFieldsRight = [
    ['Billing', 'prepaid'],
    ['Category', categoryLabel],
    ['KYC Status', kycStatus],
    ['Account Status', accountStatus],
  ]

  const billingFieldsLeft = [
    ['COD Gap', billingPreference?.frequency === 'weekly' ? 'Delivery Date + 5 Days' : 'Delivery Date + 7 Days'],
    ['Billing Dates', billingPreference?.frequency === 'monthly' ? '1' : '1'],
    ['COD Dates', billingPreference?.frequency === 'weekly' ? '1,7,14,21' : '1'],
  ]

  const weightRows = [
    {
      mode: 'surface',
      baseWeight: '0.50 Kgs.',
      additionalWeight: '0.50 Kgs.',
    },
  ]

  const billingAddress = profile?.companyInfo?.companyAddress || '33 NIRMAL SHOPPING CENTER DADRA SILVASSA'
  const billingState = profile?.companyInfo?.state || 'Dadra & Nagar Haveli'
  const bankName = profile?.bankDetails?.primaryAccount?.bankName || 'INDIAN BANK'
  const bankBranch = profile?.bankDetails?.primaryAccount?.branch || 'SILVASA'
  const bankAccountName = profile?.bankDetails?.primaryAccount?.accountHolder || companyName
  const bankAccountNumber = profile?.bankDetails?.primaryAccount?.accountNumber || '6353561742'
  const bankIfsc = profile?.bankDetails?.primaryAccount?.ifsc || 'IDIB000S187'

  if (isLoading && !profile) {
    return (
      <div className="profilemain profile-loading">
        <CircularProgress size={28} />
      </div>
    )
  }

  return (
    <div className="warpperzzz">
      <div className="profilemain">
        <div className="top__profile">
          <div className="top____sss">
            <div className="top___left profiles01">
              <ul>
                <li>
                  <img src={avatarUrl} alt={companyName} />
                </li>
                <li>
                  <h3>{companyName}</h3>
                  <small>{businessLabel}</small>
                </li>
              </ul>
            </div>

            <div className="top___right profilesd">
              <ul>
                {accountFieldsLeft.map(([label, value]) => (
                  <LabelValue key={label} label={label} value={value} />
                ))}
              </ul>

              <ul>
                {accountFieldsRight.map(([label, value]) => (
                  <LabelValue
                    key={label}
                    label={label}
                    value={value}
                    success={label === 'KYC Status' || label === 'Account Status'}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="nav___Profile">
          <div className="topnav-btn profile">
            <ul>
              {PROFILE_TABS.map((tab) => (
                <li key={tab.path}>
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) => `topnav-btn ${isActive ? 'active' : ''}`.trim()}
                    end={tab.path === '/my-profile'}
                  >
                    {tab.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {activeTab === 'account' ? (
          <div className="profile__bottom">
            <div className="top___right acountde">
              <ul>
                <LabelValue label="Billing Address" value={billingAddress} />
                <LabelValue label="Billing State" value={billingState} />
                <li>
                  <span className="unbold__title profils">
                    <h6>Multi Factor Authentication</h6>
                    <p>Currently we only support Email based Multi Factor Authentication</p>
                  </span>
                  <span className="bol___text profilesds">
                    <Switch checked={false} color="warning" />
                  </span>
                </li>
              </ul>

              <ul>
                <LabelValue label="Bank Account Name" value={bankAccountName} />
                <LabelValue label="Bank Account #" value={bankAccountNumber} />
                <LabelValue label="IFSC Code" value={bankIfsc} />
                <LabelValue label="Bank Name & Branch" value={`${bankName} ${bankBranch}`.trim()} />
              </ul>
            </div>
          </div>
        ) : null}

        {activeTab === 'billing' ? (
          <div className="profile__bottom">
            <div className="top___right acountde billingdetail-content">
              <ul>
                {billingFieldsLeft.map(([label, value]) => (
                  <LabelValue key={label} label={label} value={value} />
                ))}
              </ul>

              <div className="table__warpped7894">
                <div className="top____heading mb-3">
                  <h3>Weight Slabs</h3>
                </div>
                <table className="table-main">
                  <thead>
                    <tr>
                      <th>
                        <span className="w-101 d-flex">Express Mode</span>
                      </th>
                      <th>Base Wt.</th>
                      <th>Add. Wt.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weightRows.map((row) => (
                      <tr key={row.mode}>
                        <td>{row.mode}</td>
                        <td>{row.baseWeight}</td>
                        <td>{row.additionalWeight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'history' ? (
          <div className="profile__bottom">
            <div className="notification-settingtabel loginbilling">
              <div className="tickets_table recharge_historty logincomponant">
                <div className="table-body recharge_historty">
                  <div className="ant-table-wrapper table-main">
                    <div className="ant-spin-nested-loading">
                      <div className="ant-spin-container">
                        <div className="ant-table">
                          <div className="ant-table-container">
                            <div className="ant-table-content">
                              <table style={{ tableLayout: 'auto' }}>
                                <thead className="ant-table-thead">
                                  <tr>
                                    <th className="ant-table-cell">Login Time</th>
                                    <th className="ant-table-cell">Login Location</th>
                                    <th className="ant-table-cell">Login IP</th>
                                    <th className="ant-table-cell">Platform Used</th>
                                    <th className="ant-table-cell">Device Type</th>
                                  </tr>
                                </thead>
                                <tbody className="ant-table-tbody">
                                  {SAMPLE_LOGIN_HISTORY.map((row) => (
                                    <tr key={`${row[0]}-${row[2]}`} className="ant-table-row ant-table-row-level-0">
                                      {row.map((cell, index) => (
                                        <td key={`${cell}-${index}`} className="ant-table-cell">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="d__1144fooetr">
          <div className="d__1144fooetr" />
        </div>
      </div>
    </div>
  )
}
