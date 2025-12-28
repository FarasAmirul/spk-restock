import "../config/env.js"
import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
  console.log("===== AUTH MIDDLEWARE =====")
  console.log("URL:", req.originalUrl)
  console.log("AUTH HEADER:", req.headers.authorization)

  const authHeader = req.headers.authorization

  if (!authHeader) {
    console.log("❌ HEADER TIDAK ADA")
    return res.status(401).json({ message: "Akses ditolak. Token tidak ada" })
  }

  const token = authHeader.split(" ")[1]
  console.log("TOKEN:", token)

  if (!token) {
    console.log("❌ FORMAT TOKEN SALAH")
    return res.status(401).json({ message: "Akses ditolak. Format token salah" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("✅ TOKEN VALID:", decoded)

    req.user = decoded
    next()
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message)
    return res.status(401).json({ message: "Token tidak valid atau expired" })
  }
}
