import { storage } from "../storage/userStorage";
import type { TokenLedgerEntry } from "../models";

const LEDGER_KEY = "tokenLedger";

export class TokenService {
  /**
   * Obtiene todo el historial de transacciones (ledger) del usuario actual.
   */
  static getLedger(): TokenLedgerEntry[] {
    return storage.get<TokenLedgerEntry[]>(LEDGER_KEY, []);
  }

  /**
   * Obtiene el balance actual de tokens.
   */
  static getBalance(): number {
    const ledger = this.getLedger();
    return ledger.reduce((sum, entry) => {
      if (entry.type === "earn" || entry.type === "purchase")
        return sum + entry.amount;
      if (entry.type === "spend") return sum - entry.amount;
      return sum;
    }, 0);
  }

  /**
   * Agrega un nuevo registro al ledger.
   */
  static addEntry(
    type: "earn" | "purchase" | "spend",
    amount: number,
    reason: string,
  ): TokenLedgerEntry {
    const entry: TokenLedgerEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      type,
      amount,
      reason,
    };

    const ledger = this.getLedger();
    ledger.push(entry);
    storage.set(LEDGER_KEY, ledger);

    // Dispatch a custom event to notify UI components (e.g. TokenShop) about the balance change
    window.dispatchEvent(
      new CustomEvent("timelock:balance_update", {
        detail: { newBalance: this.getBalance() },
      }),
    );

    return entry;
  }

  /**
   * Intenta gastar tokens. Retorna true si fue exitoso, false si no hay suficientes tokens.
   */
  static spendTokens(amount: number, reason: string): boolean {
    if (this.getBalance() >= amount) {
      this.addEntry("spend", amount, reason);
      return true;
    }
    return false;
  }

  /**
   * Premia tokens al usuario.
   */
  static earnTokens(amount: number, reason: string) {
    this.addEntry("earn", amount, reason);
  }
}
