import { useContext } from "react";
import { Contact as ContactType } from "../../../util/contacts";
import { PhoneCallIcon, VideoIcon } from "lucide-react";
import { MainContext } from "../../MainContext";
import OptionsDropdown from "../OptionsDropdown";

export default function Contact({ contact }: { contact: ContactType }) {
  const { setIsVoiceCalling, setIsVideoCalling, setCurrentReciever } =
    useContext(MainContext);
  const handleCurrentReciever = () => {
    setCurrentReciever(contact);
  };
  return (
    <div
      className="flex items-center gap-4 px-4 py-2 cursor-pointer transition duration-300 text-slate-200 hover:text-slate-700  hover:bg-slate-700 hover:bg-white"
      onClick={handleCurrentReciever}
    >
      <div
        className={`flex-shrink-0 w-[80px] h-[80px] rounded-full`}
        style={{
          backgroundImage: `url(${contact.img})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          imageRendering: "auto",
        }}
      ></div>
      <div className="flex-grow">
        <p className="font-bold">{contact.name}</p>
        <p className="text-sm text-slate-400">{contact.phonenumber}</p>
      </div>
      <div className="flex-shrink-0 flex justify-center items-center gap-8">
        <div
          onClick={() => setIsVoiceCalling(true)}
          className="transition duration-300 rounded-full hover:text-white hover:bg-red-400 p-4 hover:rounded-full"
        >
          <PhoneCallIcon size={26} />
        </div>
        <div
          onClick={() => setIsVideoCalling(true)}
          className="transition duration-300 rounded-full hover:text-white hover:bg-red-400 p-4 hover:rounded-full"
        >
          <VideoIcon size={26} />
        </div>
        <OptionsDropdown />
      </div>
    </div>
  );
}
