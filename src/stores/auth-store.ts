// stores/ApiStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import axios, { AxiosResponse } from "axios";
import { QueryClient } from "@tanstack/react-query";

export interface User {
  full_name: string;
  email: string;
  token: string;
}

export class AuthStore {
  user: User | null = null;
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
    this.loadUserFromLocalStorage();
  }

  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  get isAuthenticated() {
    return !!this.user?.token;
  }

  login(user: User) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this.user = null;
    localStorage.removeItem("user");
    this.queryClient.clear();
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
      });
      localStorage.setItem("user", JSON.stringify(userData));
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

  clearStore() {
    this.user = null;
    localStorage.removeItem("user");
  }
}
