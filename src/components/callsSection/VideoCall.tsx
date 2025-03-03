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
  const { setCurrentCallingType } = useContext(MessagesContext);

  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

  const handleCameraToggle = () => {
    if (isCameraOn) {
      setIsCameraOn(false);
    } else {
      setIsCameraOn(true);
    }
  };

  const handleEndVideoCall = () => {
    setCurrentCallingType("voice");
    socket!.emit("finish_call", {
      requesterPhonenumber: requester.phonenumber,
    });
  };

  return (
    <div className="absolute flex flex-col justify-center items-center w-screen h-screen bg-slate-700">
      <div className="relative flex justify-center items-center h-full w-full bg-white rounded-lg">
        <div className="absolute  w-full h-full bg-slate-500 rounded-md">
          <video
            ref={remoteVideoRef}
            className="w-full h-full"
            autoPlay
            playsInline
            muted
          ></video>
        </div>

        <div className="absolute right-2 bottom-2 flex justify-center items-center w-[300px] h-[225px] bg-slate-100 rounded-md">
          {isCameraOn ? (
            <video
              ref={localVideoRef}
              className="w-full h-full rounded-md"
              autoPlay
              playsInline
              muted
            ></video>
          ) : (
            <div className="p-6  w-fit rounded-full bg-slate-200 shadow-sm">
              <CameraOffIcon size={58} className="text-slate-500" />
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-8 py-6">
        <div
          onClick={() => setIsMicOn(!isMicOn)}
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
