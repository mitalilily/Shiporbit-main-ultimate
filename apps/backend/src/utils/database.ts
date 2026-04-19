type SslConfig = false | { rejectUnauthorized: false }

const SSL_DISABLED_VALUES = new Set(['disable', 'disabled', 'false', 'off', '0'])
const SSL_RELAXED_VALUES = new Set(['allow', 'prefer'])
const SSL_REQUIRED_VALUES = new Set(['require', 'required', 'true', 'on', '1'])

export function resolveDatabaseSsl(databaseUrl?: string): SslConfig {
  const sslMode = (process.env.PGSSLMODE || '').trim().toLowerCase()
  const normalizedUrl = databaseUrl || ''
  const isRailwayInternal = /railway\.internal/i.test(normalizedUrl)
  const needsHostedSsl =
    /render\.com|railway\.app|rlwy\.net|supabase\.co|neon\.tech|amazonaws\.com/i.test(
      normalizedUrl,
    )

  if (SSL_DISABLED_VALUES.has(sslMode)) return false
  if (SSL_REQUIRED_VALUES.has(sslMode)) return { rejectUnauthorized: false }
  if (SSL_RELAXED_VALUES.has(sslMode)) {
    return isRailwayInternal ? false : { rejectUnauthorized: false }
  }
  if (isRailwayInternal) return false
  return needsHostedSsl ? { rejectUnauthorized: false } : false
}
