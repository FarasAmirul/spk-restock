import pool from "../config/db.js";

// GET semua nilai
export const getAllNilai = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        n.id,
        b.nama AS nama_barang,
        k.nama AS nama_kriteria,
        n.nilai
      FROM nilai n
      JOIN barang b ON n.barang_id = b.id
      JOIN kriteria k ON n.kriteria_id = k.id
      ORDER BY n.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST nilai
export const createNilai = async (req, res) => {
  const { barang_id, kriteria_id, nilai } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO nilai (barang_id, kriteria_id, nilai)
       VALUES ($1, $2, $3) RETURNING *`,
      [barang_id, kriteria_id, nilai]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT nilai
export const updateNilai = async (req, res) => {
  const { id } = req.params;
  const { barang_id, kriteria_id, nilai } = req.body;
  try {
    const result = await pool.query(
      `UPDATE nilai 
       SET barang_id=$1, kriteria_id=$2, nilai=$3 
       WHERE id=$4 RETURNING *`,
      [barang_id, kriteria_id, nilai, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE nilai
export const deleteNilai = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM nilai WHERE id=$1", [id]);
    res.json({ message: "Nilai berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET nilai per barang
export const getNilaiByBarang = async (req, res) => {
  const { barang_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        n.id,
        k.kode AS kode_kriteria,
        k.nama AS nama_kriteria,
        n.nilai
      FROM nilai n
      JOIN kriteria k ON n.kriteria_id = k.id
      WHERE n.barang_id = $1
    `, [barang_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
