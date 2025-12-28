import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kriteria ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { kode, nama, bobot, atribut } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO kriteria (kode, nama, bobot, atribut) VALUES ($1, $2, $3, $4) RETURNING *",
      [kode, nama, bobot, atribut]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { kode, nama, bobot, atribut } = req.body;
  try {
    const result = await pool.query(
      "UPDATE kriteria SET kode=$1, nama=$2, bobot=$3, atribut=$4 WHERE id=$5 RETURNING *",
      [kode, nama, bobot, atribut, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM kriteria WHERE id=$1", [id]);
    res.json({ message: "Kriteria berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
