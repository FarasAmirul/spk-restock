import pool from '../config/db.js'

export const hitungSAW = async (req, res) => {
  try {
    // 1. Ambil semua data nilai + kriteria + barang
    const query = `
      SELECT 
        b.id AS barang_id,
        b.nama AS barang_nama,
        k.id AS kriteria_id,
        k.nama AS kriteria_nama,
        k.bobot,
        k.atribut,
        n.nilai
      FROM nilai n
      JOIN barang b ON n.barang_id = b.id
      JOIN kriteria k ON n.kriteria_id = k.id
      ORDER BY b.id, k.id
    `
    const { rows } = await pool.query(query)

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Data nilai belum lengkap' })
    }

    // 2. Kelompokkan nilai per barang
    const dataBarang = {}
    rows.forEach(r => {
      if (!dataBarang[r.barang_id]) {
        dataBarang[r.barang_id] = {
          barang_id: r.barang_id,
          nama: r.barang_nama,
          nilai: []
        }
      }
      dataBarang[r.barang_id].nilai.push(r)
    })

    // 3. Cari max & min tiap kriteria
    const nilaiMax = {}
    const nilaiMin = {}

    rows.forEach(r => {
      if (!nilaiMax[r.kriteria_id] || r.nilai > nilaiMax[r.kriteria_id]) {
        nilaiMax[r.kriteria_id] = r.nilai
      }
      if (!nilaiMin[r.kriteria_id] || r.nilai < nilaiMin[r.kriteria_id]) {
        nilaiMin[r.kriteria_id] = r.nilai
      }
    })

    // 4a. Hitung tabel normalisasi
const normalisasi = []

Object.values(dataBarang).forEach(barang => {
  const row = {
    barang_id: barang.barang_id,
    nama: barang.nama,
    nilai: {}
  }

  barang.nilai.forEach(k => {
    let hasil = 0

    if (k.atribut === 'benefit') {
      hasil = k.nilai / nilaiMax[k.kriteria_id]
    } else {
      hasil = nilaiMin[k.kriteria_id] / k.nilai
    }

    row.nilai[k.kriteria_nama] = Number(hasil.toFixed(4))
  })

  normalisasi.push(row)
})


    // 4. Hitung nilai preferensi SAW
    const hasil = []

    Object.values(dataBarang).forEach(barang => {
      let total = 0

      barang.nilai.forEach(k => {
        let normalisasi = 0

        if (k.atribut === 'benefit') {
          normalisasi = k.nilai / nilaiMax[k.kriteria_id]
        } else {
          normalisasi = nilaiMin[k.kriteria_id] / k.nilai
        }

        total += normalisasi * k.bobot
      })

      hasil.push({
        barang_id: barang.barang_id,
        nama: barang.nama,
        nilai_preferensi: Number(total.toFixed(4))
      })
    })

    // 5. Ranking
    hasil.sort((a, b) => b.nilai_preferensi - a.nilai_preferensi)

    hasil.forEach((h, i) => {
      h.ranking = i + 1
    })

    res.json({
  metode: "SAW (Simple Additive Weighting)",
  normalisasi,
  hasil
})


  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
