import { WalletService } from "../src/services/wallet.services";
import { TransactionService } from "../src/services/transaction.service";
import { DB } from "../src/db/memory.db";

beforeEach(() => {
  DB.wallets.clear();
  DB.transactions.clear();
});

describe("TransactionService", () => {
  test("credits correctly with valid precision", async () => {
    const { wallet } = WalletService.createWallet("W", 0.1);

    const { balance } = await TransactionService.transact(wallet.id, 0.2, "Credit test");

    expect(balance).toBe(0.3);
    const updated = DB.wallets.get(wallet.id);
    expect(updated?.balance).toBe(0.3);
  });

  test("debits correctly with valid precision", async () => {
    const { wallet } = WalletService.createWallet("W", 100);

    const { balance } = await TransactionService.transact(wallet.id, -20.5, "Debit test");

    expect(balance).toBe(79.5);
    const updated = DB.wallets.get(wallet.id);
    expect(updated?.balance).toBe(79.5);
  });

  test("rejects invalid precision (>4 decimals)", async () => {
    const { wallet } = WalletService.createWallet("W", 10);

    await expect(
      TransactionService.transact(wallet.id, 50.123456, "Invalid precision")
    ).rejects.toThrow("Amount/Balance can have at most 4 decimal places.");
  });

  test("fails for non-existing wallet", async () => {
    await expect(
      TransactionService.transact("fake-wallet", 10, "Test")
    ).rejects.toThrow("Wallet not found");
  });

  test("creates a transaction entry", async () => {
    const { wallet } = WalletService.createWallet("W", 10);

    await TransactionService.transact(wallet.id, 5, "Test txn");

    const txns = Array.from(DB.transactions.values()).filter(
      t => t.walletId === wallet.id
    );

    // Setup transaction + 1 credit
    expect(txns.length).toBe(2);
  });
});
