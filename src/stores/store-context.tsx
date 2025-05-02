import { createContext, ReactNode } from "react";
import { AuthStore } from "./auth-store";
import { UiViewStore } from "./ui-view-store";
import { QueryClient } from "@tanstack/react-query";
import { SocketStore } from "./socket-store";
import { RoomStore } from "./room-store";

const queryClient = new QueryClient();
const socketStore = new SocketStore();

export const store = {
  authStore: new AuthStore(queryClient, socketStore),
  uiViewStore: new UiViewStore(),
  roomStore: new RoomStore(queryClient),
  queryClient,
};

export const StoreContext = createContext(store);

export const StoreProvider = ({ children }: { children: ReactNode }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
