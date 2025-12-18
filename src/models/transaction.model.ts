export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  balance: number;
  description: string;
  type: "CREDIT" | "DEBIT";
  date: Date;
}
