import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { acceptFriendRequests, getFriendRequests } from "../lib/api";
import { UserPlus, BellIcon, ClockIcon, MessageSquareIcon } from "lucide-react";
import NoNotificationsFound from "../Components/NoNotificationsFound";
import { capitalize } from "../lib/utils";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const [buttonId, setButtonId] = useState(null);

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incommingRequests = friendRequests?.incommingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  return (
    <div className="flex flex-col sm:p-4 md:p-6 lg:p-7 gap-2" data-theme="home">
      <h1 className="text-3xl font-bold">Notifications</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <>
          {incommingRequests.length > 0 && (
            <>
              <section className="flex gap-2">
                <UserPlus />
                <p className="font-semibold">Friend Requests</p>
                <button className="badge badge-primary ml-1">
                  {incommingRequests.length}
                </button>
              </section>

              <div className="space-y-3">
                {incommingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-14 h-14 rounded-full bg-base-300">
                            <img src={request.sender.profilePicture} alt="" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {capitalize(request.sender.name)}
                            </h3>
                            <div className="flex flex-row items-center gap-2">
                              <span className="badge badge-secondary badge-sm">
                                Native:{" "}
                                {capitalize(request.sender.nativeLanguage)}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                Learning:{" "}
                                {capitalize(request.sender.learningLanguage)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setButtonId(request._id);
                            acceptRequestMutation(request._id, {
                              onSettled: () => setButtonId(null),
                            });
                          }}
                          disabled={buttonId === request._id}
                        >
                          {buttonId === request._id
                            ? "Processing..."
                            : "Accept"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {acceptedRequests.length > 0 && (
            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-success" />
                New Connections
              </h2>

              <div className="space-y-3">
                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="card bg-base-200 shadow-sm"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className="avatar mt-1 size-10 rounded-full">
                          <img
                            src={notification.recipient.profilePicture}
                            alt={notification.recipient.name}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {capitalize(notification.recipient.name)}
                          </h3>
                          <p className="text-sm my-1">
                            {capitalize(notification.recipient.name)} accepted
                            your friend request
                          </p>
                          <p className="text-xs flex items-center opacity-70">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Recently
                          </p>
                        </div>
                        <div className="badge badge-success">
                          <MessageSquareIcon className="h-3 w-3 mr-1" />
                          New Friend
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {incommingRequests.length === 0 && acceptedRequests.length === 0 && (
            <NoNotificationsFound />
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPage;
