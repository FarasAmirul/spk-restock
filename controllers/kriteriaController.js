import pool from '../config/db.js'

// Ambil semua kriteria
export const getKriteria = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kriteria ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
