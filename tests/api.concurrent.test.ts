import request from "supertest";
import app from "../src/app";
import { DB } from "../src/db/memory.db";

beforeEach(() => {
  DB.wallets.clear();
  DB.transactions.clear();
});

describe("Concurrent API requests", () => {
  test("API handles concurrent credit/debit safely", async () => {
    // 1. Create wallet
    const res = await request(app)
      .post("/setup")
      .send({ balance: 100, name: "Concurrent Wallet" });

    const walletId = res.body.id;

    // 2. Hit API concurrently
    const promiseA = request(app)
      .post(`/transact/${walletId}`)
      .send({ amount: 20, description: "Add 20" });

    const promiseB = request(app)
      .post(`/transact/${walletId}`)
      .send({ amount: -5, description: "Subtract 5" });

    await Promise.all([promiseA, promiseB]);

    // 3. Get final wallet state
    const wallet = await request(app).get(`/wallet/${walletId}`);

    expect(wallet.body.balance).toBe(115);
  });
});
