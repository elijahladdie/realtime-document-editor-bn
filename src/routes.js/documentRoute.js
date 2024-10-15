import express from 'express';
import { getDocument } from '../controllers/documentController.js';

const router = express.Router();

router.get("/", getDocument);

export default router;
