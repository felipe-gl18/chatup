import { useContext } from "react";
import { PhoneCallIcon, VideoIcon } from "lucide-react";
import OptionsDropdown from "../OptionsDropdown";
import { MainContext } from "../../MainContext";

export default function CurrentMessageReciever() {
  const { setIsVoiceCalling, setIsVideoCalling, currentReciever } =
    useContext(MainContext);
  return (
    <div className="w-full flex items-center gap-4 bg-white p-4 shadow-md">
      <div
        className="w-[80px] h-[80px] rounded-full shadow-md"
        style={{
          backgroundImage: `url(${currentReciever.img})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          imageRendering: "auto",
        }}
      ></div>
      <p className="flex flex-grow font-bold">{currentReciever.name}</p>
      <div className="flex-shrink-0 flex justify-center items-center gap-8">
        <div
          onClick={() => setIsVoiceCalling(true)}
          className="transition duration-300 rounded-full cursor-pointer  hover:text-white hover:bg-red-400 p-2 hover:rounded-full"
        >
          <PhoneCallIcon size={26} />
        </div>
        <div
          onClick={() => setIsVideoCalling(true)}
          className="transition duration-300 rounded-full cursor-pointer hover:text-white hover:bg-red-400 p-2 hover:rounded-full"
        >
          <VideoIcon size={26} />
        </div>
        <OptionsDropdown />
      </div>
    </div>
  );
}
