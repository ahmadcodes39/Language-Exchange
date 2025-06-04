import React from "react";
import { getFriends } from "../lib/api.js";
import { useQuery } from "@tanstack/react-query";
import NoFriends from "../Components/HomePageComponents/NoFriends.jsx";
import FriendCard from "../Components/HomePageComponents/FriendCard.jsx";

const FriendsPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  return (
    <div className="flex flex-col items-start p-2 md:p-4 lg:p-6 gap-4"data-theme="home">
       <h1 className="text-3xl font-bold">My Friends</h1>
      {loadingFriends ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : friends.length === 0 ? (
        <NoFriends />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
