import { Outlet } from "react-router-dom";
import { NavBar } from "./navbar";
import { Footer } from "./footer";

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
      <div style={{ flex: 1, height: "calc(100vh - 145px)" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
