import dotenv from 'dotenv'
import path from 'path'
import { Pool } from 'pg'
import { resolveDatabaseSsl } from './src/utils/database'

const env = process.env.NODE_ENV || 'development'
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: resolveDatabaseSsl(process.env.DATABASE_URL),
})

async function testConnection() {
  try {
    console.log('db string', process.env.DATABASE_URL)
    const res = await pool.query('SELECT NOW()')
    console.log('Connection successful:', res.rows[0])
    await pool.end()
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection()
