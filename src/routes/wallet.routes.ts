import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";

const router = Router();

router.post("/setup", WalletController.setup);
router.get("/wallet/:id", WalletController.getWallet);

export default router;
