import fileSaver from "file-saver";

const { saveAs } = fileSaver;

export class Transaction {
  index: number;
  date: number;
  description: string;
  amount: number;
  balance: number;
  accountNumber: string;

  constructor(
    date: number,
    index: number,
    description: string,
    amount: number,
    balance: number,
    accountNumber: string,
  ) {
    this.index = index;
    this.date = date;
    this.description = description;
    this.amount = amount;
    this.balance = balance;
    this.accountNumber = accountNumber;
  }

  getCheckValue(): string {
    return `${this.date}-${this.index}-${this.amount}-${this.accountNumber}`;
  }
}

export class TransactionsData {
  existing: Set<string>;
  transactions: Transaction[];
  accountNumbers: Set<string>;

  constructor() {
    this.existing = new Set<string>();
    this.transactions = [];
    this.accountNumbers = new Set<string>();
  }

  addTransaction(transaction: Transaction): boolean {
    // Combine date, index, amount and account number for uniqueness check
    const checkValue = transaction.getCheckValue();
    if (this.existing.has(checkValue)) {
      return false; // Duplicate transaction, not added
    }
    this.existing.add(checkValue);
    this.accountNumbers.add(transaction.accountNumber);
    this.transactions.push(transaction);
    return true; // Transaction added successfully
  }

  /* Sort reverse order by date, index then account number*/
  sortTransactions(): void {
    this.transactions.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date - a.date;
      }
      if (a.index !== b.index) {
        return b.index - a.index;
      }
      return a.accountNumber.localeCompare(b.accountNumber);
    });
  }

  formatDateForCSV(date: number): string {
    return new Date(date).toISOString().slice(0, 10);
  }

  exportToCSV(): void {
    const csvContent = this.transactions
      .map((tx) =>
        [
          this.formatDateForCSV(tx.date),
          tx.index,
          `"${tx.description.replace(/"/g, '""')}"`, // Escape double quotes in description
          tx.amount.toFixed(2),
          tx.balance.toFixed(2),
          tx.accountNumber,
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  }
}
