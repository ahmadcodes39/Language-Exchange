import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { capitalize } from "../lib/utils.js";

import { useEffect, useState } from "react";
import {
  getFriends,
  getOutgoingFriendRequests,
  getRecommendedFriends,
  sendFriendRequest,
} from "../lib/api.js";

import TopHeader from "../Components/HomePageComponents/TopHeader.jsx";
import FriendCard from "../Components/HomePageComponents/FriendCard.jsx";
import NoFriends from "../Components/HomePageComponents/NoFriends.jsx";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MapPinIcon, UserPlusIcon, CheckCircleIcon } from "lucide-react";
import toast from "react-hot-toast";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestIds, setoutgoingRequestIds] = useState(new Set());
  const [sendingRequests, setSendingRequests] = useState(new Set()); // Track per-user loading

  const getLanguageFlag = (language) => {
    if (!language) return null;
    // const languageLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[language];

    if (countryCode) {
      return (
        <img
          src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`${language} flag`}
          className="mr-1 size-3 inline-block"
        />
      );
    }

    return null;
  };

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedFriends,
  });

  const {
    data: outGoingFriendRequests = [],
    isLoading: loadingOutgoingRequests,
  } = useQuery({
    queryKey: ["outgoing-friend-requests"],
    queryFn: getOutgoingFriendRequests,
    select: (data) => (Array.isArray(data) ? data : []),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to reduce refetches
  });

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (recipientId) => {
      setSendingRequests((prev) => new Set(prev).add(recipientId));
    },
    onSuccess: (_, recipientId) => {
      setoutgoingRequestIds((prev) => new Set(prev).add(recipientId));
      toast.success("Friend request sent");
      queryClient.invalidateQueries(["outgoing-friend-requests"]);
    },
    onError: (error, recipientId) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
    onSettled: (_, __, recipientId) => {
      setSendingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipientId);
        return newSet;
      });
    },
  });

  useEffect(() => {
    if (Array.isArray(outGoingFriendRequests)) {
      const outgoingRequestsIds = new Set();
      if (outGoingFriendRequests && outGoingFriendRequests.length > 0) {
        outGoingFriendRequests.forEach((request) => {
          outgoingRequestsIds.add(request.recipient._id);
        });
      }
      setoutgoingRequestIds(outgoingRequestsIds);
    } else {
      setoutgoingRequestIds(new Set());
    }
  }, [outGoingFriendRequests]);

  return (
    <div className="px-6" data-theme="home">
      <TopHeader />

      {loadingFriends ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : friends.length === 0 ? (
        <NoFriends />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...friends.reverse().slice(0, 4)].map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}

      {/* Recommended Users Section */}
      <section>
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Meet New Learners
              </h2>
              <p className="opacity-70">
                Discover perfect language exchange partners based on your
                profile
              </p>
            </div>
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center py-12 ">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">
              No recommendations available
            </h3>
            <p className="text-base-content opacity-70">
              Check back later for new language partners!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.map((user) => {
              // Check if a request has been sent, prioritizing outgoingRequestIds but falling back to outGoingFriendRequests
              const hasRequestBeenSent =
                outgoingRequestIds.has(user._id) ||
                (Array.isArray(outGoingFriendRequests) &&
                  outGoingFriendRequests.some(
                    (req) => req.recipient._id === user._id
                  ));
              const isSending = sendingRequests.has(user._id);
              // console.log("hasRequestBeenSent: ", hasRequestBeenSent);
              return (
                <div
                  key={user._id}
                  className="card bg-base-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img src={user.profilePicture} alt={user.fullName} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        {user.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-secondary">
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {capitalize(user.nativeLanguage)}
                      </span>
                      <span className="badge badge-outline">
                        {getLanguageFlag(user.learningLanguage)}
                        Learning: {capitalize(user.learningLanguage)}
                      </span>
                    </div>
                    {user.Bio && (
                      <p className="text-sm opacity-70">{user.Bio}</p>
                    )}
                    <button
                      className={`btn w-full mt-2 ${
                        hasRequestBeenSent
                          ? "btn-disabled"
                          : // : isSending || loadingOutgoingRequests
                            // ? "btn-disabled btn-outline"
                            "btn-primary"
                      }`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={
                        hasRequestBeenSent ||
                        isSending ||
                        loadingOutgoingRequests
                      }
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : isSending || loadingOutgoingRequests ? (
                        <>
                          <span className="loading loading-spinner size-4 mr-2" />
                          {isSending ? "Sending..." : "Loading..."}
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
