import { parsePdfBytesWithWasm } from "./wasm/transtractorWasm";
import { Transaction } from "./types";

function toEpochMillis(value: number): number {
  // WASM parser dates are unix epochs and may be returned in seconds.
  return value < 1_000_000_000_000 ? value * 1000 : value;
}

async function parsePDF(file: File): Promise<Transaction[]> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const transactions: Transaction[] = [];
  const statementData = await parsePdfBytesWithWasm(bytes);
  for (const parsed of statementData.transactions) {
    const tx = new Transaction(
      toEpochMillis(parsed.date),
      parsed.index,
      parsed.description,
      parsed.amount,
      parsed.balance,
      statementData.account_number,
    );
    transactions.push(tx);
  }
  return transactions;
}

export default parsePDF;
