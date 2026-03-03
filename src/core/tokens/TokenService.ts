import {
  addLedgerEntry,
  getLedger,
  getTokenBalance,
  uid,
  type TokenLedgerEntry,
} from "../../lib/storage";

export class TokenService {
  /**
   * Obtiene todo el historial de transacciones (ledger) del usuario actual.
   */
  static getLedger(): TokenLedgerEntry[] {
    return getLedger();
  }

  /**
   * Obtiene el balance actual de tokens.
   */
  static getBalance(): number {
    return getTokenBalance();
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
      id: uid(),
      timestamp: Date.now(),
      type,
      amount,
      reason,
    };

    addLedgerEntry(entry);

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
