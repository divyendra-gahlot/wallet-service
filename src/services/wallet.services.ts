import { DB } from "../db/memory.db";
import { Wallet } from "../models/wallet.models";
import { Transaction } from "../models/transaction.model";
import { add } from "../utils/bigDecimal";
import { randomUUID } from "crypto";
import { validatePrecision } from "../utils/validatePrecision";

export class WalletService {

  static createWallet(name: string, balance: number) {
    console.log(`[WalletService] Creating wallet → name=${name}, balance=${balance}`);

    const id = randomUUID(); // Universal Unique Identifier

    validatePrecision(balance); // Validating if the balance has no more than 4 digits after decimal

    const wallet: Wallet = {
      id,
      name,
      balance,
      date: new Date(),
    };

    DB.wallets.set(id, wallet);

    console.log(`[WalletService] Wallet created → id=${id}, balance=${balance}`);

    // Adding initial transaction
    const txn: Transaction = {
      id: randomUUID(),
      walletId: id,
      amount: balance,
      balance: balance,
      description: "Setup",
      type: "CREDIT",
      date: new Date()
    };

    DB.transactions.set(txn.id, txn);

    console.log(`[WalletService] Setup transaction added → txnId=${txn.id} for wallet ${id}`);

    return { wallet, transactionId: txn.id };
  }

  static getWallet(id: string) {
    console.log(`[WalletService] Fetching wallet → id=${id}`);
    return DB.wallets.get(id) || null;
  }
}
