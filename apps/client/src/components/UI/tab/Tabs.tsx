import {
  alpha,
  Box,
  Divider,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  styled,
  useTheme,
  type TabsProps,
} from '@mui/material'
import * as React from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'

type StatusColor = 'primary' | 'success' | 'warning' | 'error' | undefined

export interface TabItem<T extends string = string> {
  label: string
  value: T
  icon?: React.ReactElement
  badgeCount?: number
  statusColor?: StatusColor
  to?: string
}

interface SmartTabsProps<T extends string = string> {
  tabs: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  muiTabsProps?: Omit<TabsProps, 'value' | 'onChange'>
}

const StyledTabs = styled(Tabs)(() => ({
  minHeight: 0,
  '& .MuiTabs-flexContainer': {
    gap: 8,
    flexWrap: 'wrap',
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 0,
  minWidth: 0,
  textTransform: 'none',
  borderRadius: 10,
  padding: '9px 16px',
  fontWeight: 600,
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.text.primary,
    borderColor: alpha(theme.palette.primary.main, 0.16),
  },
  '&.Mui-selected': {
    color: '#ffffff',
    background: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}))

const CounterChip = styled('span')(({ theme }) => ({
  fontSize: '0.72rem',
  padding: '3px 8px',
  borderRadius: 999,
  background: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  fontWeight: 800,
}))

export function SmartTabs<T extends string = string>({
  tabs,
  value,
  onChange,
  muiTabsProps,
}: SmartTabsProps<T>) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const visibleCount = 5
  const visibleTabs = tabs.slice(0, visibleCount)
  const overflowTabs = tabs.slice(visibleCount)
  const isOverflowSelected = overflowTabs.some((t) => t.value === value)
  const controlledValue = isOverflowSelected ? '__more__' : value

  const handleChange = (_: React.SyntheticEvent, val: unknown) => {
    if (val === '__more__') return
    onChange(val as T)
  }

  return (
    <Box>
      <Box
        sx={{
          p: 0.6,
          borderRadius: 3,
          display: 'block',
          background: '#ffffff',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: `0 8px 22px ${alpha(theme.palette.text.primary, 0.04)}`,
          overflowX: 'auto',
        }}
      >
        <StyledTabs value={controlledValue} onChange={handleChange} {...muiTabsProps}>
          {visibleTabs.map((tab) => {
            const labelContent = (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {tab.icon ? <Box sx={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</Box> : null}
                {tab.label}
                {typeof tab.badgeCount === 'number' && <CounterChip>{tab.badgeCount}</CounterChip>}
              </Box>
            )
            return <StyledTab key={tab.value} value={tab.value} label={labelContent} disableRipple />
          })}

          {overflowTabs.length > 0 && (
            <>
              <StyledTab
                label={<FiMoreHorizontal />}
                value="__more__"
                onClick={handleOpen}
                disableRipple
                sx={
                  isOverflowSelected
                    ? {
                        color: theme.palette.text.primary,
                        background: alpha(theme.palette.primary.main, 0.12),
                      }
                    : undefined
                }
              />
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                    background: '#ffffff',
                    boxShadow: `0 18px 38px ${alpha(theme.palette.text.primary, 0.1)}`,
                    minWidth: 220,
                  },
                }}
              >
                {overflowTabs.map((t) => (
                  <MenuItem
                    key={t.value}
                    selected={value === t.value}
                    onClick={() => {
                      onChange(t.value)
                      handleClose()
                    }}
                    sx={{ fontWeight: 700, gap: 1 }}
                  >
                    {t.label}
                    {typeof t.badgeCount === 'number' && <CounterChip>{t.badgeCount}</CounterChip>}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </StyledTabs>
      </Box>
      <Divider sx={{ mt: 1.25, borderColor: alpha(theme.palette.primary.main, 0.08) }} />
    </Box>
  )
}
