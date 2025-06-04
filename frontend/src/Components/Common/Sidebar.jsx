import React from "react";
import useAuthUser from "../../hooks/useAuthUser.js";
import { Link, useLocation } from "react-router";
import { BellRing, Dot, ShipWheel } from "lucide-react";
import { Home } from "lucide-react";
import { UsersRound } from "lucide-react";
const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-48 bg-base-200 border-r border-base-300 hidden lg:flex lg:flex-col sticky top-0 h-screen">
      {/* logo section */}
      <div className="flex flex-col justify-start items-start p-3">
        <section className="flex justify-start items-center gap-2 mb-1">
          <ShipWheel className="size-5 text-primary" />
          <h1 className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </h1>
        </section>
      </div>

      <div className="flex flex-col gap-1 items-start justify-start">
        <Link
          to={"/"}
          className={`flex gap-5 p-4 cursor-pointer btn-ghost rounded-md w-full ${
            currentPath == "/" ? "btn-active" : ""
          }`}
        >
          <Home /> Home
        </Link>
        <Link
          to={"/friends"}
          className={`flex gap-5 p-4 cursor-pointer btn-ghost rounded-md w-full ${
            currentPath == "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersRound /> Friends
        </Link>
        <Link
          to={"/notification"}
          className={`flex gap-5 p-4 cursor-pointer btn-ghost rounded-md w-full ${
            currentPath == "/notification" ? "btn-active" : ""
          }`}
        >
          <BellRing /> Notifications
        </Link>
      </div>
      <div className="mt-auto border-t border-base-300">
        <div className="flex items-center justify-start p-4 gap-3">
          <img
            src={authUser?.profilePicture}
            className="size-12 rounded-full overflow-hidden"
            alt=""
          />
          <section className="flex flex-col gap-1">
            <p className="text-xs">{authUser?.name}</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span className="text-xs">Online</span>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
