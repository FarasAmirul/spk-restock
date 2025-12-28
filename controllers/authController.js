import "../config/env.js"
import pool from "../config/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" })
  }

  const query = `
    SELECT * FROM admin_users
    WHERE username = $1
  `
  const { rows } = await pool.query(query, [username])

  if (rows.length === 0) {
    return res.status(401).json({ message: "Login gagal" })
  }

  const admin = rows[0]
  const isMatch = bcrypt.compareSync(password, admin.password)

  if (!isMatch) {
    return res.status(401).json({ message: "Login gagal" })
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.json({ token })
}
