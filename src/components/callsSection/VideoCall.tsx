import {
  CameraIcon,
  CameraOffIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
} from "lucide-react";
import { MutableRefObject, useContext, useState } from "react";
import { MessagesContext } from "../../MessagesContext";
import { UserContext } from "../../UserContext";
import { Contact } from "../../ContactsContext";

export default function VideoCall({
  requester,
  localVideoRef,
  remoteVideoRef,
}: {
  requester: Contact;
  localVideoRef: MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: MutableRefObject<HTMLVideoElement | null>;
}) {
  const { socket } = useContext(UserContext);
  const { setCurrentCallingType, setIsOnACall } = useContext(MessagesContext);

  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

  const handleMicToggle = () => {
    const localStream = localVideoRef.current?.srcObject as MediaStream;

    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      console.log(audioTrack);

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

  const handleCameraToggle = () => {
    const localStream = localVideoRef.current?.srcObject as MediaStream;
    console.log(localStream);

    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      console.log(videoTrack);

      if (videoTrack) {
        if (isCameraOn) {
          videoTrack.enabled = false;
          setIsCameraOn(false);
        } else {
          videoTrack.enabled = true;
          setIsCameraOn(true);
        }
      }
    }
  };

  const handleEndVideoCall = () => {
    setIsOnACall(false);
    setCurrentCallingType("voice");

    const localStream = localVideoRef.current?.srcObject as MediaStream;
    if (localStream) localStream.getTracks().forEach((track) => track.stop());

    socket!.emit("finish_call", {
      requesterPhonenumber: requester.phonenumber,
    });
  };

  return (
    <div className="absolute flex flex-col justify-center items-center w-screen h-screen bg-slate-700">
      <div className="relative flex justify-center items-center h-full w-full bg-white rounded-lg">
        <div className="absolute flex items-center justify-center  w-full h-full bg-slate-500 rounded-md">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          ></video>
        </div>

        <div className="absolute right-2 bottom-2 flex justify-center items-center w-[300px] h-[225px] bg-slate-100 rounded-md">
          <video
            ref={localVideoRef}
            className={`w-full h-full rounded-md ${!isCameraOn && "hidden"}`}
            autoPlay
            playsInline
          ></video>

          <div
            className={`p-6  w-fit rounded-full bg-slate-200 shadow-sm ${
              isCameraOn && "hidden"
            }`}
          >
            <CameraOffIcon size={58} className="text-slate-500" />
          </div>
        </div>
      </div>
      <div className="flex gap-8 py-6">
        <div
          onClick={handleMicToggle}
          className="bg-white cursor-pointer rounded-full w-min p-4 transition duration-300 hover:text-white hover:bg-slate-600"
        >
          {isMicOn ? <MicIcon /> : <MicOffIcon />}
        </div>
        <div
          onClick={handleCameraToggle}
          className="bg-white cursor-pointer rounded-full w-min p-4 transition duration-300 hover:text-white hover:bg-slate-600"
        >
          {isCameraOn ? <CameraIcon /> : <CameraOffIcon />}
        </div>
        <div
          onClick={handleEndVideoCall}
          className="bg-red-400 text-white cursor-pointer rounded-full w-min p-4 transition duration-300"
        >
          <PhoneOffIcon />
        </div>
      </div>
    </div>
  );
}
