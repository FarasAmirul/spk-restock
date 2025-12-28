import "./config/env.js"   // ⬅️ WAJIB PALING ATAS

import express from "express"
import cors from "cors"
import pool from "./config/db.js"

import authRoutes from "./routes/authRoutes.js"
import barangRoutes from "./routes/barangRoutes.js"
import kriteriaRoutes from "./routes/kriteriaRoutes.js"
import nilaiRoutes from "./routes/nilaiRoutes.js"
import sawRoutes from "./routes/sawRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())

// test database
pool.connect()
  .then(() => console.log("✅ Database terkoneksi"))
  .catch(err => console.error("❌ DB error:", err.message))

app.get("/", (req, res) => {
  res.json({ message: "🚀 Server berjalan" })
})

app.use("/api/auth", authRoutes)
app.use("/api/barang", barangRoutes)
app.use("/api/kriteria", kriteriaRoutes)
app.use("/api/nilai", nilaiRoutes)
app.use("/api/saw", sawRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`)
})
