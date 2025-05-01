import { Outlet } from "react-router-dom";
import { NavBar } from "../components/navbar";
import { Footer } from "./footer";

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
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
    <Footer />
  </div>
);
