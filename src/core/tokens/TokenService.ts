/**
 * @file TokenService.ts
 * @description Servicio de gestión de tokens.
 *
 * Clase estática que centraliza todas las operaciones con tokens:
 * ganar, gastar y consultar balance. Usa el book mayor (ledger) almacenado
 * con namespace de usuario. Emite un evento personalizado cuando el balance
 * cambia para que los componentes de UI se actualicen reactivamente.
 */

import { storage } from "../storage/userStorage";
import type { TokenLedgerEntry } from "../models";

/** Clave de almacenamiento para el libro mayor de tokens */
const LEDGER_KEY = "tokenLedger";

export class TokenService {
  /**
   * Obtiene todo el historial de transacciones del usuario actual.
   * @returns Array con todas las entradas del libro mayor
   */
  static getLedger(): TokenLedgerEntry[] {
    return storage.get<TokenLedgerEntry[]>(LEDGER_KEY, []);
  }

  /**
   * Calcula el balance actual de tokens.
   * Suma ganancias y compras, resta gastos.
   * @returns Balance total de tokens
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
   * Agrega una nueva entrada al libro mayor y emite evento de actualización.
   * Los componentes de UI escuchan el evento `timelock:balance_update`
   * para refrescar el balance mostrado.
   *
   * @param type - Tipo de transacción: "earn", "purchase" o "spend"
   * @param amount - Cantidad de tokens
   * @param reason - Motivo de la transacción
   * @returns La entrada creada
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

    // Emitir evento para notificar a componentes de UI sobre el cambio de balance
    window.dispatchEvent(
      new CustomEvent("timelock:balance_update", {
        detail: { newBalance: this.getBalance() },
      }),
    );

    return entry;
  }

  /**
   * Intenta gastar tokens. Verifica que el balance sea suficiente antes de proceder.
   *
   * @param amount - Cantidad de tokens a gastar
   * @param reason - Motivo del gasto
   * @returns `true` si el gasto fue exitoso, `false` si el balance es insuficiente
   */
  static spendTokens(amount: number, reason: string): boolean {
    if (this.getBalance() >= amount) {
      this.addEntry("spend", amount, reason);
      return true;
    }
    return false;
  }

  /**
   * Otorga tokens al usuario como recompensa.
   * @param amount - Cantidad de tokens a otorgar
   * @param reason - Motivo de la recompensa
   */
  static earnTokens(amount: number, reason: string) {
    this.addEntry("earn", amount, reason);
  }
}
