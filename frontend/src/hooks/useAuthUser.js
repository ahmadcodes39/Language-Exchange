import React from "react";
import { getAuthUser } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authMe"],
    queryFn: getAuthUser,
    retry: false, // speciffically for auth check
  });
  return { isLoading: authUser.isLoading, authUser: authUser.data?.user};
};

export default useAuthUser;
