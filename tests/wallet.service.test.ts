import { WalletService } from "../src/services/wallet.services";
import { DB } from "../src/db/memory.db";

beforeEach(() => {
  DB.wallets.clear();
  DB.transactions.clear();
});
// wallet service tests
describe("WalletService.createWallet", () => {
  test("creates wallet with correct data", () => {
    const { wallet, transactionId } = WalletService.createWallet("Test", 50.1234);

    expect(wallet.name).toBe("Test");
    expect(wallet.balance).toBe(50.1234);
    expect(wallet.id).toBeDefined();
    expect(transactionId).toBeDefined();
  });

  test("rejects initial balance with >4 decimals", () => {
    expect(() =>
      WalletService.createWallet("Test", 50.123456)
    ).toThrow("Amount/Balance can have at most 4 decimal places");
  });

  test("creates setup transaction automatically", () => {
    const { wallet } = WalletService.createWallet("A", 10);

    const txns = Array.from(DB.transactions.values());
    expect(txns.length).toBe(1);

    const txn = txns[0];
    expect(txn.walletId).toBe(wallet.id);
    expect(txn.amount).toBe(10);
    expect(txn.type).toBe("CREDIT");
  });
});
