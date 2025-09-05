import express from "express";
import { getChamadosArea } from "../controllers/filtragemController.js";
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

router.get("/filtrar", authMiddleware, getChamadosArea);

export default router;
