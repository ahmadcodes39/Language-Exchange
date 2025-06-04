import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import useAuthUser from "../../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../lib/api.js";
import { BellIcon, LogOut, ShipWheel } from "lucide-react";
import toast from "react-hot-toast"; // Added for toast notifications
import ThemeSelector from "../ThemeSelector.js";

const Navbar = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => logout(), 
    onSuccess: () => {
      queryClient.invalidateQueries(["authMe"]);
    },
    onError: (error) => {
      console.log(error?.response?.data?.message);
      toast.error("Logout failed. Please try again."); 
    },
  });

  // const {logoutMutation} = useLogout()

  return (
    <div
      className="bg-base-200 border-b border-base-300 sticky top-0 z-30 flex items-center"

    >
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center w-full">
          {/* Show logo on chat page */}
          {isChatPage && (
            <div className="flex flex-col justify-start items-start p-3">
              <section className="flex justify-start items-center gap-2 mb-1">
                <ShipWheel className="size-9 text-primary" />
                <Link to={"/"} className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </Link>
              </section>
            </div>
          )}

          <div className="flex gap-3 sm:gap-4 items-center ml-auto">
            <Link to="/notification">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="size-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* Themes selector */}
          <ThemeSelector />
          {/* Profile picture */}
          <div className="avatar flex items-center">
            <div className="size-8 rounded-full">
              <img src={authUser?.profilePicture} alt="" /> 
            </div>

            {/* Logout button */}
            <div className="flex gap-3 sm:gap-4 items-center">
              <button className="btn btn-ghost btn-circle" onClick={() => logoutMutation()}>
                <LogOut className="size-6 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;