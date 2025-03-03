import { MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { MutableRefObject, useContext, useState } from "react";
import { MessagesContext } from "../../MessagesContext";
import { Contact, ContactsContext } from "../../ContactsContext";
import { UserContext } from "../../UserContext";

export default function VoiceCall({
  requester,
  localAudioRef,
  remoteAudioRef,
}: {
  requester: Contact;
  localAudioRef: MutableRefObject<HTMLAudioElement | null>;
  remoteAudioRef: MutableRefObject<HTMLAudioElement | null>;
}) {
  const { socket } = useContext(UserContext);
  const { setIsOnACall } = useContext(MessagesContext);
  const { selectedContact } = useContext(ContactsContext);

  const [isMicOn, setIsMicOn] = useState<boolean>(true);

  const handleMicToggle = () => {
    const localStream = localAudioRef.current?.srcObject as MediaStream;
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        if (isMicOn) {
          audioTrack.enabled = false;
          setIsMicOn(false);
        } else {
          audioTrack.enabled = true;
          setIsMicOn(true);
        }
      }
    }
  };

  const handleEndVoiceCall = () => {
    setIsOnACall(false);
    const localStream = localAudioRef.current?.srcObject as MediaStream;
    if (localStream) localStream.getTracks().forEach((track) => track.stop());

    socket!.emit("finish_call", {
      requesterPhonenumber: requester.phonenumber,
    });
  };

  return (
    <div className="absolute flex flex-col gap-8 justify-center items-center w-screen h-screen bg-slate-700">
      <div
        className={`flex-shrink-0 w-[162px] h-[162px] rounded-full`}
        style={{
          backgroundImage: `url(${selectedContact!.img})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          imageRendering: "auto",
        }}
      ></div>
      <audio ref={localAudioRef} autoPlay playsInline muted></audio>
      <audio ref={remoteAudioRef} autoPlay playsInline></audio>
      <div className="flex gap-8">
        <div
          onClick={handleMicToggle}
          className="bg-white cursor-pointer rounded-full w-min p-4 transition duration-300 hover:text-white hover:bg-slate-600"
        >
          {isMicOn ? <MicIcon /> : <MicOffIcon />}
        </div>
        <div
          onClick={handleEndVoiceCall}
          className="bg-red-400 text-white cursor-pointer rounded-full w-min p-4 transition duration-300"
        >
          <PhoneOffIcon />
        </div>
      </div>
    </div>
  );
}
