import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";

export class TransactionController {

  static async transact(req: Request, res: Response) {
    console.log(`[Controller] POST /transact/${req.params.walletId} → Request received`);
    console.log(`[Controller] Body:`, req.body);

    const { amount, description } = req.body;

    try {
      const result = await TransactionService.transact(
        req.params.walletId,
        amount,
        description
      );
      console.log(`[Controller] POST /transact/${req.params.walletId} → Sending response`);
      return res.json(result);

    } catch (err: any) {
        console.error(`[Controller] Error in /transact:`, err.message);
        return res.status(400).json({ message: err.message });
    }
  }

  static listTransactions(req: Request, res: Response) {
    console.log(`[Controller] GET /transactions → Request received with query`, req.query);
    const { walletId, skip = 0, limit = 10 } = req.query;

    const txns = TransactionService.fetchTransactions(
      String(walletId),
      Number(skip),
      Number(limit)
    );
    console.log(`[Controller] GET /transactions → Sending response with ${txns.length} transactions`);
    return res.json(txns);
  }
}
