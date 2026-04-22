import axios from 'axios'
import crypto from 'crypto'
import dotenv from 'dotenv'
import path from 'path'
import Razorpay from 'razorpay'

const env = process.env.NODE_ENV || 'development'
dotenv.config({ path: path.resolve(__dirname, `../../.env.${env}`) })

type RazorpayMode = 'test' | 'live'

function normalizeMode(mode: string | undefined): RazorpayMode {
  if (mode === 'live' || mode === 'test') return mode
  return process.env.NODE_ENV === 'production' ? 'live' : 'test'
}

export const RAZORPAY_MODE: RazorpayMode = normalizeMode(process.env.RAZORPAY_MODE)

const CREDENTIALS: Record<RazorpayMode, { key_id: string; key_secret: string }> = {
  test: {
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  live: {
    key_id: process.env.RAZORPAY_KEY_ID_PROD || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET_PROD || '',
  },
}

export const razorpayCredentials = CREDENTIALS[RAZORPAY_MODE]

export const isRazorpayConfigured = Boolean(
  razorpayCredentials.key_id && razorpayCredentials.key_secret,
)

function maskKey(key: string) {
  if (!key) return 'missing'
  if (key.length <= 8) return `${key.slice(0, 2)}***`
  return `${key.slice(0, 6)}***${key.slice(-4)}`
}

if (!isRazorpayConfigured) {
  console.warn(
    `[Razorpay] Missing credentials for ${RAZORPAY_MODE.toUpperCase()} mode. Wallet topups are disabled until env vars are set.`,
  )
}

export const razorpay = new Razorpay({
  key_id: razorpayCredentials.key_id || 'disabled',
  key_secret: razorpayCredentials.key_secret || 'disabled',
})

if (isRazorpayConfigured) {
  console.info(
    `[Razorpay] Initialised in ${RAZORPAY_MODE.toUpperCase()} mode with key ${maskKey(razorpayCredentials.key_id)}`,
  )
}

export const razorpayApi = axios.create({
  baseURL: 'https://api.razorpay.com/v1',
  auth: {
    username: razorpayCredentials.key_id || 'disabled',
    password: razorpayCredentials.key_secret || 'disabled',
  },
})

export function isValidSig(body: string, sig: string) {
  const expected = crypto
    .createHmac(
      'sha256',
      RAZORPAY_MODE === 'live'
        ? process.env.RAZORPAY_WEBHOOK_SECRET_PROD || ''
        : process.env.RAZORPAY_WEBHOOK_SECRET || '',
    )
    .update(body)
    .digest('hex')
  return expected === sig
}
