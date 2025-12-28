import express from "express"
import { hitungSAW } from "../controllers/sawController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, hitungSAW)

export default router
