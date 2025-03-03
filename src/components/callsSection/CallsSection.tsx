import { useContext } from "react";
import { MessagesContext } from "../../MessagesContext";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";
import Receiver from "./Receiver";
import { ContactsContext } from "../../ContactsContext";
import Requester from "./Requester";

export default function CallsSection() {
  const {
    isOnACall,
    isReceivingCall,
    isRequestingCall,
    currentCallingType,
    localVideoRef,
    remoteVideoRef,
  } = useContext(MessagesContext);
  const { selectedContact } = useContext(ContactsContext);
  const call = {
    voice: <VoiceCall requester={selectedContact!} />,
    video: (
      <VideoCall
        requester={selectedContact!}
        localVideoRef={localVideoRef!}
        remoteVideoRef={remoteVideoRef!}
      />
    ),
  };
  return (
    <>
      {isRequestingCall && <Requester receiver={selectedContact!} />}
      {isReceivingCall && <Receiver requester={selectedContact!} />}
      {isOnACall && call[currentCallingType]}
    </>
  );
}
