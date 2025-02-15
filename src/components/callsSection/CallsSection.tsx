import { useContext } from "react";
import { MessagesContext } from "../../MessagesContext";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";

export default function CallsSection() {
  const { isVoiceCalling, isVideoCalling } = useContext(MessagesContext);
  return (
    <>
      {isVoiceCalling ? <VoiceCall /> : isVideoCalling ? <VideoCall /> : null}
    </>
  );
}
