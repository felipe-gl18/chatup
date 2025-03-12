import { useContext } from "react";
import { MessagesContext } from "../../MessagesContext";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";
import Receiver from "./Receiver";
import { ContactsContext } from "../../ContactsContext";
import Requester from "./Requester";

export default function CallsSection() {
  const { callStatus, currentCallingType, localStreamRef, remoteStreamRef } =
    useContext(MessagesContext);

  const { selectedContact } = useContext(ContactsContext);

  const call = {
    voice: (
      <VoiceCall
        requester={selectedContact!}
        localAudioRef={localStreamRef!}
        remoteAudioRef={remoteStreamRef!}
      />
    ),
    video: (
      <VideoCall
        requester={selectedContact!}
        localVideoRef={localStreamRef!}
        remoteVideoRef={remoteStreamRef!}
      />
    ),
  };

  return (
    <>
      {callStatus == "requesting" && <Requester />}
      {callStatus == "receiving" && <Receiver requester={selectedContact!} />}
      {callStatus == "calling" && call[currentCallingType]}
    </>
  );
}
