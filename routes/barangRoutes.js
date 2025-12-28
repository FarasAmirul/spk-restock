import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Ambil semua barang
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM barang ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ambil barang berdasarkan ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM barang WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Barang tidak ditemukan" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah barang + nilai otomatis
router.post("/", async (req, res) => {
  const { nama, stok, penjualan, lead_time, harga } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const resultBarang = await client.query(
      "INSERT INTO barang (nama, stok, penjualan, lead_time, harga) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nama, stok, penjualan, lead_time, harga]
    );
    const barangBaru = resultBarang.rows[0];

    const resultKriteria = await client.query("SELECT id, kode FROM kriteria");
    for (const k of resultKriteria.rows) {
      let nilaiAwal = 0;
      switch (k.kode) {
        case "C1": nilaiAwal = stok; break;
        case "C2": nilaiAwal = penjualan; break;
        case "C3": nilaiAwal = lead_time; break;
        case "C4": nilaiAwal = harga; break;
      }
      await client.query(
        "INSERT INTO nilai (barang_id, kriteria_id, nilai) VALUES ($1, $2, $3)",
        [barangBaru.id, k.id, nilaiAwal]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Barang berhasil ditambah", data: barangBaru });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Update barang dan nilai
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, stok, penjualan, lead_time, harga } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const resultBarang = await client.query(
      "UPDATE barang SET nama=$1, stok=$2, penjualan=$3, lead_time=$4, harga=$5 WHERE id=$6 RETURNING *",
      [nama, stok, penjualan, lead_time, harga, id]
    );
    if (resultBarang.rows.length === 0)
      return res.status(404).json({ error: "Barang tidak ditemukan" });

    const resultKriteria = await client.query("SELECT id, kode FROM kriteria");
    for (const k of resultKriteria.rows) {
      let nilaiBaru = 0;
      switch (k.kode) {
        case "C1": nilaiBaru = stok; break;
        case "C2": nilaiBaru = penjualan; break;
        case "C3": nilaiBaru = lead_time; break;
        case "C4": nilaiBaru = harga; break;
      }
      await client.query(
        "UPDATE nilai SET nilai=$1 WHERE barang_id=$2 AND kriteria_id=$3",
        [nilaiBaru, id, k.id]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Barang berhasil diperbarui", data: resultBarang.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Hapus barang
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM barang WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Barang tidak ditemukan" });
    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
