import { Box, Container, Drawer, Stack, useMediaQuery, useTheme } from '@mui/material'
import { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DRAWER_WIDTH } from '../../utils/constants'
import Navbar from '../Navbar/Navbar'
import KeyboardShortcuts from './keyboard/KeyboardShortcuts'
import FullScreenLoader from './loader/FullScreenLoader'
import Sidebar, { COLLAPSED_WIDTH } from './Sidebar'

export default function Layout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [pinned, setPinned] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleDrawerToggle = () => {
    if (isMobile) setMobileOpen(!mobileOpen)
    else setPinned((prev) => !prev)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.08) 0%, transparent 22%),
          linear-gradient(180deg, #ffffff 0%, #fbfbfb 42%, #f6f8fc 100%)
        `,
      }}
    >
      <KeyboardShortcuts />

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: '#ffffff',
              color: '#171310',
              borderRight: '1px solid #ece9f1',
            },
          }}
        >
          <Sidebar
            hovered={hovered}
            setHovered={setHovered}
            pinned
            handleDrawerToggle={handleDrawerToggle}
          />
        </Drawer>
      ) : (
        <Box
          sx={{
            width: pinned ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            minWidth: pinned ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            flexShrink: 0,
            transition: 'width 240ms ease',
            position: 'relative',
            py: 1.25,
            pl: 1.25,
          }}
        >
          <Sidebar
            hovered={hovered}
            setHovered={setHovered}
            pinned={pinned}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Box>
      )}

      <Stack
        sx={{
          flexGrow: 1,
          minWidth: 0,
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
          bgcolor: 'transparent',
        }}
      >
        <Stack sx={{ flexGrow: 1, minHeight: 0, bgcolor: 'transparent' }}>
          <Navbar handleDrawerToggle={handleDrawerToggle} pinned={pinned} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              bgcolor: 'transparent',
              px: { xs: 0.85, md: 1.6 },
              pb: { xs: 1.5, md: 2.4 },
              minHeight: 0,
            }}
          >
            <Container
              maxWidth="xl"
              sx={{
                bgcolor: 'transparent',
                pt: 0.4,
                px: { xs: 0.35, md: 1.2 },
                overflowX: 'hidden',
              }}
            >
              <Suspense fallback={<FullScreenLoader />}>
                <Outlet />
              </Suspense>
            </Container>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}
