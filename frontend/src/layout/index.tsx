import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div>
      {location.pathname.includes("signIn") ||
      location.pathname.includes("signUp") ? (
        <div>{children}</div>
      ) : (
        <div>
          <Navbar />
          {children}
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
};

export default AppLayout;
