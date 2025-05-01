import { makeAutoObservable, runInAction } from "mobx";
import { Room, RoomFormInput } from "../types/types";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export class RoomStore {
  rooms: Room[] = [];
  selectedRoom: Room | null = null;
  queryClient: QueryClient;
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
  }

  async fetchUserRooms() {
    try {
      const { data } = await axios.get<Room[]>("/api/rooms/user");
      runInAction(() => {
        this.rooms = data;
      });
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  }

  async createRoom(input: RoomFormInput) {
    try {
      const { data } = await axios.post<Room>("rooms", input);
      await this.queryClient.invalidateQueries({ queryKey: ["user-rooms"] });
      return data;
    } catch (error) {
      console.error("Failed to create room", error);
      throw error;
    }
  }

  async joinRoom(roomId: string) {
    try {
      const { data } = await axios.post(`rooms/${roomId}/join`);
      await this.queryClient.invalidateQueries({ queryKey: ["user-rooms"] });
      return data;
    } catch (error) {
      console.error("Failed to join room", error);
      throw error;
    }
  }

  async fetchRoomById(roomId: string) {
    try {
      const { data } = await axios.get<Room>(`rooms/${roomId}`);
      runInAction(() => {
        this.selectedRoom = data;
      });
    } catch (error) {
      console.error("Failed to fetch room", error);
    }
  }

  clearSelectedRoom() {
    this.selectedRoom = null;
  }
}
