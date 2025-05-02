import { Outlet } from "react-router-dom";
import { NavBar } from "./navbar";

export const PublicLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        width: "100%",
      }}
    >
      <NavBar />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};
