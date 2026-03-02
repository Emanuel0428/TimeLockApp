import { NotificationItem, NotificationType } from "../models";
import { storage, generateId } from "../storage/userStorage";

const NOTIFICATIONS_KEY = "notifications_history";

export class NotificationService {
  /**
   * Request permission for Web Notifications
   */
  static async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Este navegador no soporta notificaciones de escritorio");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  /**
   * Send a system notification and save it to history
   */
  static async send(
    title: string,
    options: {
      body: string;
      type: NotificationType;
      icon?: string;
    },
  ): Promise<void> {
    const item: NotificationItem = {
      id: generateId(),
      type: options.type,
      title,
      body: options.body,
      createdAt: Date.now(),
    };

    this.saveToHistory(item);

    // Try to show system notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body: options.body,
          icon: options.icon || "/logoTimeLock.svg", // Assumes logo is in public folder
        });
      } catch (error) {
        console.error("Error showing system notification", error);
      }
    }
  }

  /**
   * Save a notification item to localStorage history
   */
  private static saveToHistory(item: NotificationItem) {
    const history = this.getHistory();
    history.unshift(item); // Add to beginning
    // Keep only last 100 notifications to prevent storage overflow
    if (history.length > 100) {
      history.pop();
    }
    storage.set(NOTIFICATIONS_KEY, history);
  }

  /**
   * Get all notifications for current user
   */
  static getHistory(): NotificationItem[] {
    return storage.get<NotificationItem[]>(NOTIFICATIONS_KEY, []);
  }

  /**
   * Mark a specific notification as read
   */
  static markAsRead(id: string) {
    const history = this.getHistory();
    const item = history.find((n) => n.id === id);
    if (item && !item.readAt) {
      item.readAt = Date.now();
      storage.set(NOTIFICATIONS_KEY, history);
    }
  }

  /**
   * Mark all notifications as read
   */
  static markAllAsRead() {
    const history = this.getHistory();
    let changed = false;
    history.forEach((item) => {
      if (!item.readAt) {
        item.readAt = Date.now();
        changed = true;
      }
    });
    if (changed) {
      storage.set(NOTIFICATIONS_KEY, history);
    }
  }

  /**
   * Clear all notification history
   */
  static clearHistory() {
    storage.set(NOTIFICATIONS_KEY, []);
  }

  /**
   * Get count of unread notifications
   */
  static getUnreadCount(): number {
    return this.getHistory().filter((n) => !n.readAt).length;
  }
}
