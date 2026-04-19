import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { HiOutlineChevronRight } from 'react-icons/hi'
import {
  MdApps,
  MdBusiness,
  MdLocalShipping,
  MdOutlineRateReview,
  MdPassword,
  MdPeopleAlt,
} from 'react-icons/md'
import { RiBankFill, RiSettings3Fill } from 'react-icons/ri'
import { TbFileInvoice, TbFileSettings, TbReceiptRupee, TbShieldCheck } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { brand } from '../../theme/brand'

type SettingItem = {
  title: string
  description: string
  path: string
  icon: ReactNode
}

type SettingGroup = {
  title: string
  items: SettingItem[]
}

const panelSx = {
  bgcolor: '#FFFFFF',
  border: '1px solid #e7ebf0',
  borderRadius: '10px',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
}

const groups: SettingGroup[] = [
  {
    title: 'Account',
    items: [
      {
        title: 'Company Details',
        description: 'Update business information and profile details.',
        path: '/profile/company',
        icon: <MdBusiness size={18} />,
      },
      {
        title: 'Change Password',
        description: 'Manage your login password and access security.',
        path: '/profile/password',
        icon: <MdPassword size={18} />,
      },
      {
        title: 'KYC Details',
        description: 'Review verification documents and compliance status.',
        path: '/profile/kyc_details',
        icon: <TbShieldCheck size={18} />,
      },
      {
        title: 'Bank Details',
        description: 'Maintain settlement and payout account details.',
        path: '/profile/bank_details',
        icon: <RiBankFill size={18} />,
      },
      {
        title: 'Manage Team',
        description: 'Create and manage team members and permissions.',
        path: '/settings/users_management',
        icon: <MdPeopleAlt size={18} />,
      },
    ],
  },
  {
    title: 'Shipping',
    items: [
      {
        title: 'Pickup Addresses',
        description: 'Add, edit, and organize pickup locations.',
        path: '/settings/manage_pickups',
        icon: <MdLocalShipping size={18} />,
      },
      {
        title: 'Invoice Settings',
        description: 'Configure invoice preferences and communication invoices.',
        path: '/settings/invoice_preferences',
        icon: <TbFileInvoice size={18} />,
      },
      {
        title: 'Billing Preferences',
        description: 'Adjust billing rules, recharge, and account preferences.',
        path: '/settings/billing_preferences',
        icon: <TbReceiptRupee size={18} />,
      },
      {
        title: 'Label Settings',
        description: 'Customize labels, printing layout, and shipment settings.',
        path: '/settings/label_config',
        icon: <TbFileSettings size={18} />,
      },
    ],
  },
  {
    title: 'Integration',
    items: [
      {
        title: 'Courier Priority',
        description: 'Set routing preferences for courier allocation.',
        path: '/settings/courier-priority',
        icon: <MdOutlineRateReview size={18} />,
      },
      {
        title: 'API Integration',
        description: 'Manage keys, integrations, and connected channels.',
        path: '/settings/api-integration',
        icon: <MdApps size={18} />,
      },
      {
        title: 'API Docs',
        description: 'Open developer documentation and integration references.',
        path: '/settings/api-docs',
        icon: <RiSettings3Fill size={18} />,
      },
    ],
  },
]

const SettingRow = ({ item, onClick }: { item: SettingItem; onClick: () => void }) => (
  <Button
    onClick={onClick}
    sx={{
      width: '100%',
      minHeight: 64,
      px: 1.25,
      py: 1.1,
      justifyContent: 'space-between',
      textTransform: 'none',
      color: '#232a34',
      borderRadius: '6px',
      '&:hover': {
        bgcolor: '#f7f8fb',
      },
    }}
  >
    <Stack direction="row" spacing={1.15} alignItems="center" sx={{ minWidth: 0, textAlign: 'left' }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '8px',
          display: 'grid',
          placeItems: 'center',
          color: brand.accent,
          bgcolor: 'rgba(255,102,0,0.08)',
          border: '1px solid rgba(255,102,0,0.12)',
          flexShrink: 0,
        }}
      >
        {item.icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1f2937' }}>
          {item.title}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.68rem',
            color: '#7c8593',
            lineHeight: 1.45,
            whiteSpace: 'normal',
          }}
        >
          {item.description}
        </Typography>
      </Box>
    </Stack>
    <HiOutlineChevronRight size={16} color="#a0a7b4" />
  </Button>
)

export default function SettingsPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ pb: 2 }}>
      <Stack spacing={1.15}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#1f2937' }}>
              Settings
            </Typography>
            <Typography sx={{ fontSize: '0.66rem', color: '#8a93a2', mt: 0.2 }}>
              Manage account, shipping, invoice, and integration options.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ ...panelSx, p: 1.1 }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: '#eef1f5', display: { xs: 'none', lg: 'block' } }} />}
            spacing={{ xs: 1.1, lg: 0 }}
          >
            {groups.map((group, index) => (
              <Box key={group.title} sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ px: 1.2, py: 0.85 }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#4b5563', letterSpacing: '0.04em' }}>
                    {group.title.toUpperCase()}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: '#eef1f5' }} />

                <Stack spacing={0.3} sx={{ p: 0.55 }}>
                  {group.items.map((item, itemIndex) => (
                    <Box key={item.path}>
                      <SettingRow item={item} onClick={() => navigate(item.path)} />
                      {itemIndex < group.items.length - 1 ? (
                        <Divider sx={{ borderColor: '#f1f4f8', ml: 1.25, mr: 1.25 }} />
                      ) : null}
                    </Box>
                  ))}
                </Stack>

                {index < groups.length - 1 ? (
                  <Divider sx={{ borderColor: '#eef1f5', display: { xs: 'block', lg: 'none' } }} />
                ) : null}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
