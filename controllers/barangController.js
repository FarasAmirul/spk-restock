import pool from '../config/db.js'

// Ambil semua barang
export const getBarang = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM barang ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Tambah barang
export const addBarang = async (req, res) => {
  try {
    const { nama, stok, penjualan, lead_time, harga } = req.body
    await pool.query(
      'INSERT INTO barang (nama, stok, penjualan, lead_time, harga) VALUES ($1, $2, $3, $4, $5)',
      [nama, stok, penjualan, lead_time, harga]
    )
    res.json({ message: 'Barang berhasil ditambahkan' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
