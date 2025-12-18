import { acquireLock, releaseLock } from "../utils/lock";
import { validatePrecision } from "../utils/validatePrecision";
import { DB } from "../db/memory.db";
import { randomUUID } from "crypto";
import { add } from "../utils/bigDecimal";

export class TransactionService {
  static async transact(walletId: string, amount: number, description: string) {
    console.log(`[TransactionService] Incoming request → walletId=${walletId}, amount=${amount}, description=${description}`);

    // Acquire wallet-level lock
    console.log(`[TransactionService] Attempting lock for wallet ${walletId}`);
    const release = await acquireLock(walletId);
    console.log(`[TransactionService] Lock acquired for wallet ${walletId}`);


    try {
      validatePrecision(amount);

      const wallet = DB.wallets.get(walletId);
      if (!wallet){
        console.error(`[TransactionService] Wallet not found: ${walletId}`);
        throw new Error("Wallet not found");
      }

      const newBalance = add(wallet.balance, amount);

      console.log(`[TransactionService] Current balance for ${walletId}: ${wallet.balance}`);

      //Update wallet atomically
      wallet.balance = newBalance;
      console.log(`[TransactionService] New balance for ${walletId}: ${newBalance}`);

      const txn = {
        id: randomUUID(),
        walletId,
        amount,
        description,
        balance: newBalance,
        type: amount >= 0 ? "CREDIT" : "DEBIT",
        date: new Date()
      };

      DB.transactions.set(txn.id, txn);

      console.log(`[TransactionService] Transaction completed → txnId=${txn.id}, amount=${amount}, newBalance=${newBalance}`);

      return {
        balance: newBalance,
        transactionId: txn.id,
      };
    } finally {
        console.log(`[TransactionService] Releasing lock for wallet ${walletId}`);
        release();
        // Always release lock even on error
        releaseLock(walletId);
        console.log(`[TransactionService] Lock released for wallet ${walletId}`);
    }
  }

  static fetchTransactions(walletId: string, skip: number, limit: number) {
    console.log(`[TransactionService] Fetching transactions for wallet ${walletId} (skip=${skip}, limit=${limit})`);

    // recent transaction shows up first
    let txns = Array.from(DB.transactions.values())
      .filter(t => t.walletId === walletId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return txns.slice(skip, skip + limit);
  }
}
