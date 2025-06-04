import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  useCallStateHooks,
  // User,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { create } from "zustand";
import PageLoader from "../Components/PageLoader";
import CallContent from "../Components/CallContent";
const STREAM_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const init = async () => {
      if (!tokenData || !authUser || !callId) return;

      try {
        console.log("Initilizing stream video call...");
        const user = {
          id: authUser._id,
          name: authUser.name,
          image: authUser.profilePicture,
        };
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        console.log("call joined successfully");

        setCall(callInstance);
        setClient(videoClient);
      } catch (error) {
        console.log("error starting the video call ", error);
      } finally {
        setIsConnecting(false);
      }
    };
    init();
  }, [tokenData, authUser, callId]);
  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {call && client ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p>Could not initilize the call.Please try again</p>
        </div>
      )}
    </div>
  );
};

export default CallPage;
