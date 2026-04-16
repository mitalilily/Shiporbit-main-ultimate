import { Box, Typography } from '@mui/material'
import React from 'react'
import './loader.css'

type Props = {
  night?: boolean
}

const FullScreenLoader: React.FC<Props> = ({ night = false }) => {
  return (
    <Box className={`loader-overlay ${night ? 'night' : ''}`}>
      <Box className="loader-content">
        <div className="logo-container">
          <img src="/logo/shiporbit-logo.jpeg" alt="ShipOrbit logo" className="loader-logo" />
        </div>
        <Typography
          sx={{
            color: '#171310',
            fontWeight: 700,
            letterSpacing: '0.14em',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
          }}
        >
          ShipOrbit
        </Typography>
      </Box>
    </Box>
  )
}

export default FullScreenLoader
