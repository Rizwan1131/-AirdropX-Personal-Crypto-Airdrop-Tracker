import express from 'express';
import { createAirdrop , deleteAirdrop, filterAirdrops, getAirdropById, getAirdropSummary, getMyAirdrops, searchAirdrops, updateAirdrop} from '../controller/airdrop.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/create',authMiddleware, createAirdrop);
router.post('/update/:id',authMiddleware, updateAirdrop);
router.delete('/delete/:id',authMiddleware, deleteAirdrop);
router.get('/get',authMiddleware, getMyAirdrops);
router.get('/get/:id',authMiddleware, getAirdropById);
router.get('/search', authMiddleware, searchAirdrops);
router.get('/filter', authMiddleware, filterAirdrops);
router.get("/summary", authMiddleware, getAirdropSummary);



export default router;
