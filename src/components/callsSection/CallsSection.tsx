import { useContext } from "react";
import { MainContext } from "../../MainContext";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";

export default function CallsSection() {
  const { isVoiceCalling, isVideoCalling } = useContext(MainContext);
  return (
    <>
      {isVoiceCalling ? <VoiceCall /> : isVideoCalling ? <VideoCall /> : null}
    </>
  );
}
