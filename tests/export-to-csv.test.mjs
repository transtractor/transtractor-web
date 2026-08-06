import test from "node:test";
import assert from "node:assert/strict";
import { TransactionsData, Transaction } from "../src/types.ts";

test("formatDateForCSV uses UTC YYYY-MM-DD", () => {
  const data = new TransactionsData();
  data.addTransaction(
    new Transaction(Date.UTC(2024, 0, 2, 3, 4, 5), 1, "Test", 10, 20, "123"),
  );

  assert.equal(
    data.formatDateForCSV(Date.UTC(2024, 0, 2, 3, 4, 5)),
    "2024-01-02",
  );
});
