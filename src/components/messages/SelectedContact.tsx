import { useContext } from "react";
import { PhoneCallIcon, UserIcon, VideoIcon } from "lucide-react";
import OptionsDropdown from "../OptionsDropdown";
import { ContactsContext } from "../../ContactsContext";
import { MessagesContext } from "../../MessagesContext";

export default function SelectedContact() {
  const { selectedContact } = useContext(ContactsContext);
  const { handleRequestCall } = useContext(MessagesContext);

  return (
    <div className="w-full flex items-center gap-4 bg-white p-4 shadow-md">
      <div className="p-6 rounded-full bg-white text-black shadow-lg">
        <UserIcon />
      </div>
      <p className="flex flex-grow font-bold">{selectedContact!.username}</p>
      <div className="flex-shrink-0 flex justify-center items-center gap-8">
        <div
          onClick={() => handleRequestCall("voice", selectedContact!)}
          className="transition duration-300 rounded-full cursor-pointer  hover:text-white hover:bg-red-400 p-2 hover:rounded-full"
        >
          <PhoneCallIcon size={26} />
        </div>
        <div
          onClick={() => handleRequestCall("video", selectedContact!)}
          className="transition duration-300 rounded-full cursor-pointer hover:text-white hover:bg-red-400 p-2 hover:rounded-full"
        >
          <VideoIcon size={26} />
        </div>
        <OptionsDropdown />
      </div>
    </div>
  );
}
