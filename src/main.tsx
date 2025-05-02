// src/main.tsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider, store } from "./stores/store-context";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={store.queryClient}>
      <StoreProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications position="bottom-right" zIndex={2077} />
          <App />
        </MantineProvider>
      </StoreProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
