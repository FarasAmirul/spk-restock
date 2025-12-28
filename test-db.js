import pkg from "pg"
import dotenv from "dotenv"

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

try {
  const res = await pool.query("select now()")
  console.log("✅ DB CONNECTED:", res.rows[0])
} catch (err) {
  console.error("❌ DB ERROR:", err.message)
}
