import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../Components/ChatLoader";
import CallButton from "../Components/CallButton";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();
  const STREAM_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // Only fetch if authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData || !authUser) return;
      try {
        console.log("Initializing chat client with token:", tokenData.token);
        const client = StreamChat.getInstance(STREAM_KEY); // initilizing the StreamChat client
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: authUser.profilePicture,
          },
          tokenData.token
        ); // connecting the user to the chat client
        const channelId = [authUser._id, targetUserId].sort().join("-"); // Create a unique channel ID based on user IDs
        // if you start a chat then channel is [you and me]
        // if me sart a chat then channel become [me and you]
        // as a human we take them as same but machine took them as different thats why we have to sort .join so that the channel remain same

        const currChanel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        setChatClient(client);
        setChannel(currChanel);
      } catch (error) {
        console.log("Error initilizing chat ...", error);
        toast.error("Could not connect to the chat please try again");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, targetUserId]);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  const handleVideoCall=()=>{
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text:`I've started a video call. Join me here: ${callUrl}`
      })
      toast.success("Video call link sent successfully")
      
    }
  }
  return (
    <div className="h-[88.5vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
