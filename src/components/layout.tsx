import { Outlet } from "react-router-dom";
import { NavBar } from "../components/navbar";
import { CreateRoomModal } from "./create-room-modal";

export const Layout = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100%",
    }}
  >
    <NavBar />
    <CreateRoomModal />
    <div style={{ flex: 1, overflow: "hidden" }}>
      <Outlet />
    </div>
  </div>
);
