// stores/ApiStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import axios, { AxiosResponse } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { SocketStore } from "./socket-store";
import { QueryKeys } from "../types/query-keys";
export interface User {
  full_name: string;
  email: string;
  token?: string;
  id?: string;
}

export class AuthStore {
  user: User | null = null;
  token: string | null = null;
  allUsers: User[] = [];
  queryClient: QueryClient;
  socketStore: SocketStore;
  isAuthenticated: boolean = false;
  constructor(queryClient: QueryClient, socketStore: SocketStore) {
    makeAutoObservable(this);
    this.queryClient = queryClient;
    this.loadUserFromLocalStorage();
    this.socketStore = socketStore;
  }

  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  get IsAuthenticated() {
    return !!this.user?.token;
  }

  get AllUsers() {
    return this.allUsers;
  }

  login(user: User) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this.user = null;
    localStorage.removeItem("user");
    this.queryClient.clear();
    this.socketStore.disconnect();
  }

  get BaseUrl() {
    return this.baseUrl;
  }

  get UserId() {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored).userId;
      } catch {
        //
      }
    }
  }

  get Token() {
    const stored = localStorage.getItem("token");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        //
      }
    }
  }

  get User() {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        //
      }
    }
  }

  private loadUserFromLocalStorage() {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        this.user = JSON.parse(stored);
      } catch {
        this.user = null;
        localStorage.removeItem("user");
      }
    }
  }

  async signUp(payload: {
    full_name: string;
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      const res: AxiosResponse<User> = await axios.post(
        `${this.baseUrl}users/signup`,
        payload
      );
      runInAction(() => {
        this.queryClient.invalidateQueries([QueryKeys.AllUsers]);
        this.allUsers.push(res.data);
      });
      return res.data;
    } catch (error) {
      console.error("Signup failed:", error);
      return null;
    }
  }

  async loginUser(payload: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      const res: AxiosResponse<User> = await axios.post(
        `${this.baseUrl}users/login`,
        payload
      );
      const userData = res.data;
      runInAction(() => {
        this.user = userData;
        this.token = userData.token ?? null;
        this.isAuthenticated = true;
      });
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", JSON.stringify(userData.token));
      this.socketStore.connect();
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  async fetchUserProfile(): Promise<User | null> {
    if (!this.user?.token) return null;

    try {
      const res: AxiosResponse<User> = await axios.get(
        `${this.baseUrl}/users/profile`,
        {
          headers: { Authorization: `Bearer ${this.user.token}` },
        }
      );

      runInAction(() => {
        this.user = res.data;
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      this.queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      return res.data;
    } catch {
      return null;
    }
  }

  async fetchAllUsers(): Promise<User[]> {
    try {
      const res = await axios.get<User[]>(`${this.baseUrl}users/allUsers`, {
        headers: { Authorization: `Bearer ${this.user?.token}` },
      });
      runInAction(() => {
        this.allUsers = res.data;
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  clearStore() {
    this.user = null;
    localStorage.removeItem("user");
  }
}
