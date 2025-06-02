import React from "react";
import { logout } from "../lib/api";
import { QueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useLogout = () => {
  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      QueryClient.invalidateQueries(["authMe"]);
    },
    onError: (error) => {
      console.log(error?.response?.data?.message);
      toast.error("Logout failed. Please try again.");
    },
  });
  return { logoutMutation };
};

export default useLogout;
