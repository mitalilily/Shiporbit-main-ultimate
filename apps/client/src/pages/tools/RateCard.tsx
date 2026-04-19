import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import Papa from 'papaparse'
import { useMemo, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import PageHeading from '../../components/UI/heading/PageHeading'
import { useShippingRates } from '../../hooks/Integrations/useCouriers'
import { useZones } from '../../hooks/useZones'
import { brand } from '../../theme/brand'

type ShippingRate = {
  id: string | number
  courier_name: string
  mode: string
  min_weight: number
  cod_charges?: number | string
  cod_percent?: number | string
  rates: Record<
    string,
    {
      forward?: number | string
      rto?: number | string
      forward_per_kg?: number | string
      rto_per_kg?: number | string
      min_weight?: number
    }
  >
}

type ZoneItem = {
  code: string
  description?: string
  name: string
}

const utilityTabs = [
  { label: 'Rate Calculator', path: '/utility/ratecalculator' },
  { label: 'Pincode Servicability', path: '/utility/pincode' },
  { label: 'Rate Card', path: '/utility/ratecard' },
]

const weightSlabs = ['0.50', '2.00', '5.00', '10.00', '20.00']

const formatCurrency = (value: unknown) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? `Rs. ${numeric.toFixed(2)}` : 'Rs. NA'
}

const getZoneRates = (
  rate: ShippingRate,
  zone: ZoneItem,
  shipmentType: 'Forward' | 'RTO',
): { primary: unknown; additional: unknown } => {
  const zoneValues = rate.rates?.[zone.name] || {}
  if (shipmentType === 'RTO') {
    return {
      primary: zoneValues.rto ?? zoneValues.rto_per_kg,
      additional: zoneValues.rto_per_kg ?? zoneValues.rto,
    }
  }
  return {
    primary: zoneValues.forward ?? zoneValues.forward_per_kg,
    additional: zoneValues.forward_per_kg ?? zoneValues.forward,
  }
}

const RateCard = () => {
  const location = useLocation()
  const isUtilityRoute = location.pathname.startsWith('/utility/')
  const [mode, setMode] = useState<'surface' | 'air'>('surface')
  const [shipmentType, setShipmentType] = useState<'Forward' | 'RTO'>('Forward')
  const [weightSlab, setWeightSlab] = useState('0.50')
  const { zones: zonesRaw } = useZones('b2c')
  const zones = useMemo(() => ((zonesRaw as ZoneItem[]) || []).slice(0, 6), [zonesRaw])
  const { data, isLoading } = useShippingRates({
    businessType: 'b2c',
    mode,
    min_weight: Number(weightSlab),
  })

  const rates: ShippingRate[] = data || []

  const handleExportCSV = () => {
    const csvData = rates.map((rate) => {
      const row: Record<string, string | number> = {
        Courier: rate.courier_name,
      }
      zones.forEach((zone) => {
        const zoneRate = getZoneRates(rate, zone, shipmentType)
        row[zone.name] = `${formatCurrency(zoneRate.primary)} | ${Number(zoneRate.additional) || 0}`
      })
      row['COD Charges'] = rate.cod_charges ?? 'NA'
      row['COD %'] = rate.cod_percent ?? 'NA'
      return row
    })
    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `rate_card_${mode}_${shipmentType.toLowerCase()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const content = (
    <Stack gap={2}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {utilityTabs.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <Box
              key={tab.path}
              component={NavLink}
              to={tab.path}
              sx={{
                px: 1.8,
                py: 1,
                borderRadius: '999px',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: active ? '#FFFFFF' : '#475467',
                bgcolor: active ? '#121212' : '#f4f6f8',
                border: '1px solid #e7ebf0',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </Box>
          )
        })}
      </Box>

      <Box
        sx={{
          border: '1px solid #eceff3',
          background: '#fff',
          borderRadius: '20px',
          p: { xs: 2, md: 2.5 },
          boxShadow: '0 12px 30px rgba(16, 24, 40, 0.04)',
        }}
      >
        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2} alignItems={{ xl: 'center' }}>
          <Box sx={{ minWidth: 230 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', mb: 0.7 }}>
              Mode <Box component="span" sx={{ color: brand.accent }}>*</Box>
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={mode}
              onChange={(_, value) => value && setMode(value)}
              sx={{ gap: 1 }}
            >
              <ToggleButton
                value="surface"
                sx={{
                  px: 1.5,
                  borderRadius: '999px !important',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&.Mui-selected': { bgcolor: '#111111', color: '#fff' },
                }}
              >
                Surface
              </ToggleButton>
              <ToggleButton
                value="air"
                sx={{
                  px: 1.5,
                  borderRadius: '999px !important',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&.Mui-selected': { bgcolor: '#111111', color: '#fff' },
                }}
              >
                Air
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ minWidth: 260 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', mb: 0.7 }}>
              Shipment Type <Box component="span" sx={{ color: brand.accent }}>*</Box>
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={shipmentType}
              onChange={(_, value) => value && setShipmentType(value)}
              sx={{ gap: 1 }}
            >
              <ToggleButton
                value="Forward"
                sx={{
                  px: 1.5,
                  borderRadius: '999px !important',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&.Mui-selected': { bgcolor: '#111111', color: '#fff' },
                }}
              >
                Forward
              </ToggleButton>
              <ToggleButton
                value="RTO"
                sx={{
                  px: 1.5,
                  borderRadius: '999px !important',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&.Mui-selected': { bgcolor: '#111111', color: '#fff' },
                }}
              >
                RTO
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ minWidth: 280 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', mb: 0.7 }}>
              Weight Slab <Box component="span" sx={{ color: brand.accent }}>*</Box>
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={weightSlab}
              onChange={(_, value) => value && setWeightSlab(value)}
              sx={{ gap: 0.8, flexWrap: 'wrap' }}
            >
              {weightSlabs.map((slab) => (
                <ToggleButton
                  key={slab}
                  value={slab}
                  sx={{
                    px: 1.2,
                    borderRadius: '999px !important',
                    textTransform: 'none',
                    fontWeight: 700,
                    '&.Mui-selected': { bgcolor: '#111111', color: '#fff' },
                  }}
                >
                  {slab} kg
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Box
              component="button"
              type="button"
              onClick={handleExportCSV}
              style={{
                minHeight: '40px',
                padding: '0 14px',
                borderRadius: '10px',
                border: '1px solid #ece9f1',
                background: '#fff',
                color: '#27303f',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <FiDownload size={16} /> Download Rate Card
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ border: '1px solid #eceff3', borderRadius: '20px', background: '#fff', overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ background: '#fff' }}>
                <TableCell sx={{ fontWeight: 700, textAlign: 'center', minWidth: 160 }}>Courier</TableCell>
                {zones.map((zone) => (
                  <TableCell key={zone.code} sx={{ fontWeight: 700, textAlign: 'center', minWidth: 130 }}>
                    <Box sx={{ display: 'grid', justifyItems: 'center', gap: 0.2 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 800 }}>{zone.name}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#667085', lineHeight: 1.4 }}>
                        {shipmentType === 'Forward' ? 'FWD' : 'RTO'} | Add.
                        <br />
                        {weightSlab}KG(s) | 0.50KG(s)
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 700, textAlign: 'center', minWidth: 140 }}>
                  COD Charges <span>|</span> COD %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && rates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={zones.length + 2} sx={{ py: 5, textAlign: 'center', color: '#6e7784' }}>
                    No data
                  </TableCell>
                </TableRow>
              ) : null}
              {rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <span>{rate.courier_name}</span>
                    </Box>
                  </TableCell>
                  {zones.map((zone) => {
                    const zoneRate = getZoneRates(rate, zone, shipmentType)
                    return (
                      <TableCell key={`${rate.id}-${zone.code}`} sx={{ textAlign: 'center' }}>
                        {formatCurrency(zoneRate.primary)} | {Number(zoneRate.additional) || 0}
                      </TableCell>
                    )
                  })}
                  <TableCell sx={{ textAlign: 'center' }}>
                    Rs. {rate.cod_charges ?? 'NA'} | {rate.cod_percent ?? 'NA'}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  )

  if (isUtilityRoute) return content

  return (
    <Stack gap={2.4}>
      <PageHeading
        eyebrow="Tools Panel"
        title="Rate Card"
        subtitle="Review courier zone-wise rates and COD configuration in one place."
      />
      {content}
    </Stack>
  )
}

export default RateCard
