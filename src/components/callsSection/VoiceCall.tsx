import { MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../MainContext";

export default function VoiceCall() {
  const { isVoiceCalling, setIsVoiceCalling, currentReciever } =
    useContext(MainContext);

  const audioRef = useRef<HTMLAudioElement>(
    new Audio("../../audiosEffect/phoneRing.wav")
  );

  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);

  const handleEndVoiceCall = () => {
    setIsVoiceCalling(false);
    setIsAnswered(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (isVoiceCalling && !isAnswered) {
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
  }, [isVoiceCalling, isAnswered]);

  return (
    <div className="absolute flex flex-col gap-8 justify-center items-center w-screen h-screen bg-slate-700">
      <div
        className={`flex-shrink-0 ${
          !isAnswered && "animate-bounce"
        } w-[162px] h-[162px] rounded-full`}
        style={{
          backgroundImage: `url(${currentReciever.img})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          imageRendering: "auto",
        }}
      ></div>
      {isAnswered && (
        <div className="flex gap-8">
          <div
            onClick={() => setIsMicOn(!isMicOn)}
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
      )}
    </div>
  );
}
