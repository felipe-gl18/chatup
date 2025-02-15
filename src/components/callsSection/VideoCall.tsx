import {
  CameraIcon,
  CameraOffIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { MessagesContext } from "../../MessagesContext";
import { startWebcam } from "../../../util/startWebcam";
import { stopWebcam } from "../../../util/stopWebcam";

export default function VideoCall() {
  const { isVideoCalling, setIsVideoCalling } = useContext(MessagesContext);

  const audioRef = useRef<HTMLAudioElement>(
    new Audio("../../audiosEffect/phoneRing.wav")
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

  const handleCameraToggle = () => {
    if (isCameraOn) {
      stopWebcam(videoRef);
      setIsCameraOn(false);
    } else {
      startWebcam(videoRef);
      setIsCameraOn(true);
    }
  };

  const handleEndVideoCall = () => {
    setIsVideoCalling(false);
    setIsAnswered(false);
    stopWebcam(videoRef);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (isVideoCalling && !isAnswered) {
      audio.play();
    }

    const timeout = setTimeout(() => {
      setIsAnswered(true);
      audio.pause();
      audio.currentTime = 0;
    }, 3500);

    return () => {
      clearTimeout(timeout);
    };
  }, [isVideoCalling, isAnswered]);

  return (
    <div className="absolute flex flex-col justify-center items-center w-screen h-screen bg-slate-700">
      <div className="relative flex justify-center items-center h-full w-full bg-white rounded-lg">
        <div className="p-6 animate-bounce rounded-full bg-slate-200">
          <CameraOffIcon size={58} className="text-slate-500" />
        </div>
        <div className="absolute right-2 bottom-2 w-[340px] h-[162px] bg-slate-500 rounded-md">
          <video
            ref={videoRef}
            className="w-full h-full"
            autoPlay
            playsInline
            muted
          ></video>
        </div>
      </div>
      {isAnswered && (
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
      )}
    </div>
  );
}
