import express from "express";
import {
  getAllNilai,
  createNilai,
  updateNilai,
  deleteNilai,
  getNilaiByBarang
} from "../controllers/nilaiController.js";

const router = express.Router();

router.get("/", getAllNilai);
router.post("/", createNilai);
router.put("/:id", updateNilai);
router.delete("/:id", deleteNilai);
router.get("/barang/:barang_id", getNilaiByBarang);

export default router;
