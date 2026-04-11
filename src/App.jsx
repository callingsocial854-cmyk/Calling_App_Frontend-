import "./App.css";
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./Components/Header";
import Banner from "./Components/Banner";
import PHeader from "./Components/Dashbaord/PHeader";
import NoInternetHeader from "./Components/NoInternetHeader";
import { useSelector } from "react-redux";
import NetworkListener from "./Components/NetworkListener";
import Team from "./Components/Team";

/* ---------------- Lazy Loaded Pages ---------------- */

const Login = lazy(() => import("./Components/Login"));
const Dashboard = lazy(() => import("./Components/Dashbaord/Dashbaord"));
const Messages = lazy(() => import("./Components/Dashbaord/Messages"));
const Profile = lazy(() => import("./Components/Dashbaord/Profile"));
// const Notifications = lazy(
//   () => import("./Components/Dashbaord/Notifications"),
// );
const Support = lazy(() => import("./Components/Dashbaord/Support"));
const InactiveQueries = lazy(
  () => import("./Components/Dashbaord/InactiveQueries"),
);
const NewQueries = lazy(() => import("./Components/Dashbaord/NewQueries"));
const Chat = lazy(() => import("./Components/Chat"));
const ChatAdmin = lazy(() => import("./Components/ChatAdmin"));
const AgentChat = lazy(() => import("./Components/AgentChat"));

/* ---------------- Layouts ---------------- */

function MainLayout({ children }) {
  return (
    <div
      id="wrapper"
      className="wrapper overflow-auto"
      style={{ height: "100vh", backgroundColor: "#615dfa" }}
    >
      <Header />
      {children}
    </div>
  );
}

function ProfileLayout({ children }) {
  return (
    <>
      <PHeader />
      {children}
    </>
  );
}

/* ---------------- Protected Route ---------------- */

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

/* ---------------- Loader ---------------- */

const PageLoader = () => <div className="page-loader">Loading...</div>;

/* ---------------- App ---------------- */




function App() {
  
  const isLoggedIn = !!localStorage.getItem("token");
  const isOnline = useSelector((state) => state.network.isOnline);

  

  return (
    <Router>
      <NetworkListener />
      {!isOnline && <NoInternetHeader />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}

          <Route
            path="/"
            element={
              <MainLayout>
                {isLoggedIn ? <Navigate to="/dashboard" replace /> : <Banner />}
              </MainLayout>
            }
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          <Route path="/agentChat" element={<AgentChat />} />
          <Route path="/team" element={<Team />} />

          {/* Protected */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <Dashboard />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/newQueries"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <NewQueries />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages/:queryId"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <Messages />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <Profile />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <Notifications />
                </ProfileLayout>
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <Support />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <Chat />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chatAdmin"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <ChatAdmin />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inactiveQueries"
            element={
              <ProtectedRoute>
                <ProfileLayout>
                  <InactiveQueries />
                </ProfileLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
