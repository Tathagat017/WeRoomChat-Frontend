import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { QueryKeys } from "../types/query-keys";
import { InvitationNotification, Room, RoomFormInput } from "../types/types";

export class RoomStore {
  userRooms: Room[] = [];
  allRooms: Room[] = [];
  selectedRoom: Room | null = null;
  invitations: InvitationNotification[] = []; // Store invitations
  queryClient: QueryClient;
  token: string | null = null;

  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
  }

  // Function to load the token from localStorage before each call
  private loadTokenFromLocalStorage(): string | null {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        return user?.token || null;
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  }

  // Dynamically get the authorization headers with token from localStorage
  private get authHeaders() {
    const token = this.loadTokenFromLocalStorage();
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {};
  }

  async fetchAllRooms() {
    try {
      const { data } = await axios.get<Room[]>(
        `${this.baseUrl}rooms/allRooms`,
        this.authHeaders
      );
      runInAction(() => {
        this.allRooms = data;
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch all rooms", error);
      return [];
    }
  }

  async fetchUserRooms() {
    try {
      const { data } = await axios.get<Room[]>(
        `${this.baseUrl}rooms/user`,
        this.authHeaders
      );
      runInAction(() => {
        this.userRooms = data;
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch rooms", error);
      return [];
    }
  }

  // Create a room
  async createRoom(input: RoomFormInput) {
    try {
      const { data } = await axios.post<Room>(
        `${this.baseUrl}rooms/create`,
        input,
        this.authHeaders
      );

      runInAction(() => {
        this.queryClient.invalidateQueries({
          queryKey: [QueryKeys.Rooms],
        });
      });

      return data;
    } catch (error) {
      console.error("Failed to create room", error);
      throw error;
    }
  }

  // Join a room
  async joinRoom(roomId: string) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}rooms/${roomId}/join`,
        {},
        this.authHeaders
      );
      await this.queryClient.invalidateQueries({ queryKey: [QueryKeys.Rooms] });
      return data;
    } catch (error) {
      console.error("Failed to join room", error);
      throw error;
    }
  }

  // Fetch a room by its ID
  async fetchRoomById(roomId: string) {
    try {
      const { data } = await axios.get<Room>(
        `${this.baseUrl}rooms/${roomId}`,
        this.authHeaders
      );
      runInAction(() => {
        this.selectedRoom = data;
      });
    } catch (error) {
      console.error("Failed to fetch room", error);
    }
  }

  // Clear the selected room
  clearSelectedRoom() {
    this.selectedRoom = null;
  }

  // Fetch all invitations for the user
  async fetchUserInvitations() {
    try {
      const { data } = await axios.get<InvitationNotification[]>(
        `${this.baseUrl}rooms/invitations`,
        this.authHeaders
      );
      runInAction(() => {
        this.invitations = data;
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch invitations", error);
      return [];
    }
  }

  // Accept an invitation
  async acceptInvitation(roomId: string) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}rooms/${roomId}/accept`,
        {},
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: [QueryKeys.Rooms] });
        this.queryClient.invalidateQueries({
          queryKey: [QueryKeys.Invitations],
        });
      });
      return data;
    } catch (error) {
      console.error("Failed to accept invitation", error);
      throw error;
    }
  }

  // Reject an invitation
  async rejectInvitation(roomId: string) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}rooms/${roomId}/reject`,
        {},
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: [QueryKeys.Rooms] });
        this.queryClient.invalidateQueries({
          queryKey: [QueryKeys.Invitations],
        });
      });

      // After rejecting, refetch the user's invitations

      return data;
    } catch (error) {
      console.error("Failed to reject invitation", error);
      throw error;
    }
  }

  async getAllChatMessages(roomId: string) {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}chats/${roomId}`,
        this.authHeaders
      );

      return data;
    } catch (error) {
      console.error("Failed to fetch chat messages", error);
      throw error;
    }
  }
}
