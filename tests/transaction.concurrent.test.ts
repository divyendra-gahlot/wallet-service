import { WalletService } from "../src/services/wallet.services";
import { TransactionService } from "../src/services/transaction.service";
import { DB } from "../src/db/memory.db";

beforeEach(() => {
  DB.wallets.clear();
  DB.transactions.clear();
});

describe("Concurrent Transactions", () => {
  test("multiple concurrent updates do NOT cause lost updates", async () => {
    const { wallet } = WalletService.createWallet("Test", 100);

    // Two operations at the same time:
    // +20 and -5
    const promiseA = TransactionService.transact(wallet.id, 20, "Add 20");
    const promiseB = TransactionService.transact(wallet.id, -5, "Subtract 5");

    // run concurrently
    const results = await Promise.all([promiseA, promiseB]);

    const updatedWallet = DB.wallets.get(wallet.id);

    // Correct final balance = 100 + 20 - 5 = 115
    expect(updatedWallet.balance).toBe(115);

    // Check both transactions recorded
    const txns = Array.from(DB.transactions.values()).filter(
      (t) => t.walletId === wallet.id
    );

    expect(txns.length).toBe(3); // setup + 2 operations
  });

  test("100 concurrent increments should all be applied safely", async () => {
    const { wallet } = WalletService.createWallet("Stress", 0);

    const increments = Array.from({ length: 100 }).map(() =>
      TransactionService.transact(wallet.id, 1, "Stress credit")
    );

    await Promise.all(increments);

    const updatedWallet = DB.wallets.get(wallet.id);

    expect(updatedWallet.balance).toBe(100);

    const txns = Array.from(DB.transactions.values()).filter(
      (t) => t.walletId === wallet.id
    );

    expect(txns.length).toBe(101); // setup + 100 ops
  });
});
