"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom = ({ chatId, audio, video }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) {
      return;
    }

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [chatId, user?.firstName, user?.lastName]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
