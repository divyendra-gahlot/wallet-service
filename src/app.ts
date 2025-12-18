import express from "express";
import walletRoutes from "./routes/wallet.routes";
import txnRoutes from "./routes/transaction.routes";
import type { ErrorRequestHandler } from "express";

// Calling express() creates: a request handler function , a middleware stack, routing logic
const app = express();
app.use(express.json());

app.use(walletRoutes);
app.use(txnRoutes);

// Global Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  return res.status(err.status || 400).json({
    status: "error",
    message: err.message,
  });
};

app.use(errorHandler);

export default app;

