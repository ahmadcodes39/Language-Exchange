import { useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ChatPage from "./Pages/ChatPage";
import CallPage from "./Pages/CallPage";
import NotificationPage from "./Pages/NotificationPage";
import OnBoardingPage from "./Pages/onBoardingPage";
import { Toaster } from "react-hot-toast";
import PageLoader from "./Components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./Components/Common/Layout";
import { useThemeStore } from "./Store/useThemeStore";
import FriendsPage from "./Pages/FriendsPage";

function App() {
  const { isLoading, authUser } = useAuthUser();
  // const authedticatedUser = authData?.user;
  const isAuthenticated = Boolean(authUser);
  const onBoarding = authUser?.isOnboarded;
  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Toaster position="top-right" />
      <div className="h-screen" data-theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && onBoarding ? (
                <Layout showSideBar={true}>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onBoarding"} />
              )
            }
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/onBoarding"
            element={
              isAuthenticated ? (
                !onBoarding ? (
                  <OnBoardingPage />
                ) : (
                  <Navigate to={"/"} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chat/:id"
            element={
              isAuthenticated && onBoarding ? (
                <Layout showSideBar={false}>
                  <ChatPage />
                </Layout>
              ) : (
                <Navigate to={isAuthenticated ? "/login" : "/onBoarding"} />
              )
            }
          />
          <Route
            path="/call/:id"
            element={
              isAuthenticated && onBoarding ? (
                <CallPage />
              ) : (
                <Navigate to={isAuthenticated ? "/login" : "/onBoarding"} />
              )
            }
          />
          <Route
            path="/notification"
            element={
              isAuthenticated && onBoarding ? (
                <Layout showSideBar={true}>
                  <NotificationPage />
                </Layout>
              ) : (
                <Navigate to={isAuthenticated ? "/login" : "/onBoarding"} />
              )
            }
          />
          <Route
            path="/friends"
            element={
              isAuthenticated && onBoarding ? (
                <Layout showSideBar={true}>
                  <FriendsPage />
                </Layout>
              ) : (
                <Navigate to={isAuthenticated ? "/login" : "/onBoarding"} />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
