import React from "react";
import { UsersRound } from "lucide-react";
import { Link } from "react-router";

const TopHeader = () => {
  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <h1 className="text-3xl font-bold">Your Friends</h1>
      <Link
        to={"/notification"}
        className="btn btn-outline rounded-full flex items-center justify-center gap-5"
      >
        <UsersRound size={20}/>
        <p className="text-sm">Friend Requests</p>
      </Link>
    </div>
  );
};

export default TopHeader;
