import {
  alpha,
  Avatar,
  Box,
  IconButton,
  Popover,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import {
  FiCheckCircle,
  FiFileText,
  FiHeadphones,
  FiHome,
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth/AuthContext'
import { usePresignedDownloadUrls } from '../../hooks/Uploads/usePresignedDownloadUrls'
import { brand } from '../../theme/brand'

const INK = brand.ink
const TEXT = brand.ink
const TEXT_SECONDARY = brand.inkSoft
const ACCENT = brand.warning
const CRIMSON = brand.danger

const getInitials = (fullName?: string) => {
  if (!fullName) return 'U'
  const parts = fullName.trim().split(/\s+/)
  const firstInitial = parts[0]?.[0] ?? ''
  const lastInitial = parts.length > 1 ? parts.at(-1)?.[0] ?? '' : ''
  return `${firstInitial}${lastInitial}`.toUpperCase()
}

const UserMenu = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { data: avatarUrl } = usePresignedDownloadUrls({
    keys: user?.companyInfo?.profilePicture,
    enabled: !!user?.companyInfo?.profilePicture,
  })

  const handleClose = () => setAnchorEl(null)

  const menuItems = [
    {
      key: 'profile-settings',
      label: 'Profile Settings',
      icon: FiUser,
      color: INK,
      onClick: () => {
        navigate('/my-profile')
        handleClose()
      },
    },
    {
      key: 'dc-address',
      label: 'DC Address',
      icon: FiHome,
      color: INK,
      onClick: () => {
        navigate('/settings/manage_pickups')
        handleClose()
      },
    },
    {
      key: 'kyc',
      label: 'KYC',
      icon: FiCheckCircle,
      color: INK,
      onClick: () => {
        navigate('/profile/kyc_details')
        handleClose()
      },
    },
    {
      key: 'change-password',
      label: 'Change Password',
      icon: FiSettings,
      color: ACCENT,
      onClick: () => {
        navigate('/profile/password')
        handleClose()
      },
    },
    {
      key: 'terms-conditions',
      label: 'Term & Conditions',
      icon: FiFileText,
      color: INK,
      onClick: () => {
        navigate('/policies/terms_of_service')
        handleClose()
      },
    },
    {
      key: 'support',
      label: 'Support',
      icon: FiHeadphones,
      color: INK,
      onClick: () => {
        navigate('/support/tickets')
        handleClose()
      },
    },
    {
      key: 'logout',
      label: 'Log out',
      icon: FiLogOut,
      color: CRIMSON,
      onClick: () => {
        logout()
        handleClose()
      },
    },
  ]

  return (
    <Box>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="small"
        sx={{
          p: 0.45,
          borderRadius: 2,
          border: `1px solid ${alpha(INK, 0.08)}`,
          bgcolor: alpha('#FFFFFF', 0.84),
          boxShadow: `0 8px 18px ${alpha(INK, 0.05)}`,
          '&:hover': {
            bgcolor: alpha(INK, 0.04),
          },
        }}
      >
        <Avatar
          src={avatarUrl?.[0] ?? ''}
          sx={{
            width: 32,
            height: 32,
            bgcolor: INK,
            fontSize: '0.82rem',
            fontWeight: 900,
            borderRadius: 2,
          }}
        >
          {getInitials(user?.companyInfo?.contactPerson || user?.name)}
        </Avatar>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.15,
            width: 294,
            borderRadius: 1.5,
            border: `1px solid ${alpha(INK, 0.08)}`,
            boxShadow: `0 0 10px ${alpha(INK, 0.16)}`,
            overflow: 'hidden',
            background: '#fff',
          },
        }}
      >
        <Box
          className="profile-menu-header"
          sx={{
            px: 2.25,
            pt: 1.35,
            pb: 1.2,
            borderBottom: `1px solid ${alpha(INK, 0.06)}`,
            bgcolor: '#fff',
          }}
        >
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 900, color: TEXT }} noWrap>
            {user?.companyInfo?.contactPerson || user?.name || 'ShipOrbit User'}
          </Typography>
          <Typography sx={{ mt: 0.3, fontSize: '0.76rem', fontWeight: 600, color: TEXT_SECONDARY }} noWrap>
            {user?.companyInfo?.contactEmail || user?.email}
          </Typography>
        </Box>

        <Box sx={{ py: 0.8 }}>
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <Box
                key={item.key}
                component="button"
                type="button"
                className={item.key === 'logout' ? 'logout-button profile-settings' : 'profile-settings'}
                onClick={item.onClick}
                sx={{
                  width: '100%',
                  border: 0,
                  bgcolor: 'transparent',
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  px: 2.25,
                  py: 1.15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease, color 0.18s ease',
                  '&:hover': {
                    bgcolor: alpha(item.color, item.key === 'logout' ? 0.08 : 0.05),
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'inherit',
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </Typography>
                <Box
                  sx={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                >
                  <Icon size={18} />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Popover>
    </Box>
  )
}

export default UserMenu

