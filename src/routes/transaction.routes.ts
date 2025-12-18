import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";

const router = Router();

router.post("/transact/:walletId", TransactionController.transact);
router.get("/transactions", TransactionController.listTransactions);

export default router;
