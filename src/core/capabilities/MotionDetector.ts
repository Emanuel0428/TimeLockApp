import { NotificationService } from "../notifications/NotificationService";
import { storage } from "../storage/userStorage";
import type { SettingsModel } from "../models";

export class MotionDetector {
  private static isListening = false;
  private static threshold = 15; // Aceleración umbral
  private static walkingSince: number | null = null;
  private static walkingWarningSent = false;

  private static handleMotion = (event: DeviceMotionEvent) => {
    // Solo actuamos si el desafío está activado.
    const settings = storage.get<SettingsModel>("settings");
    if (!settings || !settings.challenges.noWalkingGame) return;

    if (event.acceleration) {
      const { x, y, z } = event.acceleration;
      const magnitude = Math.sqrt(
        (x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2,
      );

      if (magnitude > this.threshold) {
        if (!this.walkingSince) {
          this.walkingSince = Date.now();
        } else if (
          Date.now() - this.walkingSince > 5000 &&
          !this.walkingWarningSent
        ) {
          // Caminó por más de 5 segundos
          NotificationService.send("¡Cuidado!", {
            body: "Pausa el celular mientras caminas. Mantén tu atención en el entorno.",
            type: "WARNING",
          });
          this.walkingWarningSent = true;
        }
      } else {
        // Se detuvo
        this.walkingSince = null;
        this.walkingWarningSent = false;
      }
    }
  };

  /**
   * Inicia la escucha de eventos de movimiento.
   */
  static start() {
    if (this.isListening) return;

    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      // iOS 13+ requires permission
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            window.addEventListener("devicemotion", this.handleMotion);
            this.isListening = true;
          }
        })
        .catch(console.error);
    } else {
      // Non iOS 13+ devices
      window.addEventListener("devicemotion", this.handleMotion);
      this.isListening = true;
    }
  }

  static stop() {
    if (!this.isListening) return;
    window.removeEventListener("devicemotion", this.handleMotion);
    this.isListening = false;
  }
}
