import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SuspenseLoader from "./components/suspense-loader";
import { AuthenticatedRoute } from "./routes/authenticated-routes";
import RegisterPage from "./pages/register";
import { Layout } from "./components/layout";
import { PublicLayout } from "./components/public-layout";
import LandingPage from "./pages/landing";
import { Invitations } from "./pages/invitations";

const Login = lazy(() => import("./pages/login"));
const Rooms = lazy(() => import("./pages/rooms"));
const RoomJoin = lazy(() => import("./pages/room-join"));
const RoomChatHistory = lazy(() => import("./pages/room-chat-history"));
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          {/* Public layout with navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated layout */}
          <Route
            element={
              <AuthenticatedRoute>
                <Layout />
              </AuthenticatedRoute>
            }
          >
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/invitations" element={<Invitations />} />
            <Route path="/room/:roomId" element={<RoomJoin />} />
            <Route
              path="/room/chatHistory/:roomId"
              element={<RoomChatHistory />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
