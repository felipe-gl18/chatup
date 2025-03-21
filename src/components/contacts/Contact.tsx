import { useContext } from "react";
import { ContactsContext, Contact as ContactType } from "../../ContactsContext";
import { PhoneCallIcon, UserIcon, VideoIcon } from "lucide-react";
import { MessagesContext } from "../../MessagesContext";
import Notification from "./Notification";

export default function Contact({ contact }: { contact: ContactType }) {
  const { notifications, setSelectedContact } = useContext(ContactsContext);
  const { handleRequestCall } = useContext(MessagesContext);
  const handleSelectedContact = () => setSelectedContact(contact);

  return (
    <div
      className="flex items-center gap-4 px-4 py-2 cursor-pointer transition duration-300 text-slate-200 hover:text-slate-700  hover:bg-slate-700 hover:bg-white"
      onClick={handleSelectedContact}
    >
      <div className="p-6 rounded-full bg-white text-black shadow-lg">
        <UserIcon />
      </div>
      <div className="flex items-center w-full">
        <div className="flex-grow">
          <p className="font-bold">{contact.username}</p>
          <p className="text-sm text-slate-400">{contact.email}</p>
          {notifications?.[contact.token] && (
            <Notification text={notifications?.[contact.token].text} />
          )}
        </div>
        <div className="lg:flex hidden flex-shrink-0 justify-center items-center gap-4">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleRequestCall("voice", contact);
            }}
            className="transition duration-300 rounded-full hover:text-white hover:bg-red-400 p-4 hover:rounded-full"
          >
            <PhoneCallIcon size={26} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleRequestCall("video", contact);
            }}
            className="transition duration-300 rounded-full hover:text-white hover:bg-red-400 p-4 hover:rounded-full"
          >
            <VideoIcon size={26} />
          </div>
        </div>
      </div>
    </div>
  );
}
