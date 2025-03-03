import { useContext } from "react";
import { ContactsContext, Contact as ContactType } from "../../ContactsContext";
import { PhoneCallIcon, VideoIcon } from "lucide-react";
import { MessagesContext } from "../../MessagesContext";
import OptionsDropdown from "../OptionsDropdown";
import Notification from "./Notification";

export default function Contact({ contact }: { contact: ContactType }) {
  const { notifications, setSelectedContact } = useContext(ContactsContext);
  const { handleRequestCall } = useContext(MessagesContext);
  const handleSelectedContact = () => {
    setSelectedContact(contact);
  };
  return (
    <div
      className="flex items-center gap-4 px-4 py-2 cursor-pointer transition duration-300 text-slate-200 hover:text-slate-700  hover:bg-slate-700 hover:bg-white"
      onClick={handleSelectedContact}
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
      <div className="flex items-center max-[1400px]:items-start w-full max-[1400px]:flex-col">
        <div className="flex-grow">
          <p className="font-bold">{contact.name}</p>
          <p className="text-sm text-slate-400">{contact.phonenumber}</p>
          {notifications?.[contact.phonenumber] && (
            <Notification text={notifications?.[contact.phonenumber].text} />
          )}
        </div>
        <div className="flex-shrink-0 flex justify-center items-center gap-8">
          <div
            onClick={() => handleRequestCall("voice", contact)}
            className="transition duration-300 rounded-full hover:text-white hover:bg-red-400 p-4 hover:rounded-full"
          >
            <PhoneCallIcon size={26} />
          </div>
          <div
            onClick={() => handleRequestCall("video", contact)}
            className="transition duration-300 rounded-full hover:text-white hover:bg-red-400 p-4 hover:rounded-full"
          >
            <VideoIcon size={26} />
          </div>
          <OptionsDropdown />
        </div>
      </div>
    </div>
  );
}
