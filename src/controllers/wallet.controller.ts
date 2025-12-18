import { Request, Response } from "express";
import { WalletService } from "../services/wallet.services";

export class WalletController {
  //Static function
  static setup(req: Request, res: Response) {
    const { balance, name } = req.body;

    const { wallet, transactionId } = WalletService.createWallet(name, balance);

    return res.status(200).json({
      id: wallet.id,
      balance: wallet.balance,
      name: wallet.name,
      transactionId,
      date: wallet.date
    });
  }

  static getWallet(req: Request, res: Response) {
    const wallet = WalletService.getWallet(req.params.id);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    return res.json(wallet);
  }
}
