import { makeAutoObservable, runInAction } from "mobx";
import { socket } from "../utils/socket";
import { InvitationNotification } from "../types/types";

export class SocketStore {
  notifications: InvitationNotification[] = [];
  connected = false;
  constructor() {
    makeAutoObservable(this);
  }

  get Notification() {
    return this.notifications;
  }

  private loadUserFromLocalStorage() {
    const stored = localStorage.getItem("user");
    if (stored) {
      return JSON.parse(stored);
    }
  }

  async connect() {
    if (this.connected) return; // If already connected, no need to reconnect

    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      console.log("No token found. User is not authenticated.");
      return;
    }
    const user = await this.loadUserFromLocalStorage();
    const userId = user.userId;
    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      this.connected = true;
      console.log("✅ Socket connected:", socket.id);

      if (userId) {
        socket.emit("register", userId);
      } else {
        console.log("User ID not found in localStorage.");
      }
    });

    socket.on("disconnect", () => {
      this.connected = false;
      console.log("⚠️ Socket disconnected");
    });

    // Listen for room invitations
    socket.on("roomInvitation", (payload) => {
      console.log("📩 Room invitation received:", payload);
      runInAction(() => {
        this.notifications.push(payload); // Store the invitation in the state
      });
    });
  }

  clearNotifications() {
    this.notifications = [];
  }

  disconnect() {
    socket?.disconnect();
    this.connected = false;
    this.notifications = [];
  }
}
