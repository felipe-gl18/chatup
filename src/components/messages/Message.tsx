import { TrashIcon } from "lucide-react";
import { MessagesContext, Message as MessageType } from "../../MessagesContext";
import { useContext } from "react";
import ImageViewer from "./ImageViewer";
import FileViewer from "./FileViewer";
import { ContactsContext } from "../../ContactsContext";
import { UserContext } from "../../UserContext";

export default function Message({ message }: { message: MessageType }) {
  const { user } = useContext(UserContext);
  const { selectedContact } = useContext(ContactsContext);
  const { handleDeleteMessage } = useContext(MessagesContext);

  const messageContainerStyles = {
    [user!.token]: "items-start",
    [selectedContact!.token]: "items-end",
  };

  const messageContentStyles = {
    [user!.token]: "bg-slate-700 text-white",
    [selectedContact!.token]: "bg-gray-200 text-black",
  };

  return (
    <div
      className={`group w-full space-y-2 flex flex-col ${
        messageContainerStyles[message.sender]
      }`}
    >
      <div
        className={`flex w-max max-w-[400px] flex-col gap-4 p-4 rounded-b-2xl rounded-tr-2xl ${
          messageContentStyles[message.sender]
        }`}
      >
        {message.file.content == "" ? null : <FileViewer file={message.file} />}
        {message.image.content == "" ? null : (
          <ImageViewer image={message.image} />
        )}
        {message.text == "" ? null : (
          <p className="break-normal">{message.text}</p>
        )}
        {message.audio == "" ? null : (
          <audio src={message.audio} controls className="w-full"></audio>
        )}
      </div>
      <div className={`hidden group-hover:flex cursor-pointer text-red-400`}>
        <TrashIcon
          size={18}
          onClick={() => handleDeleteMessage(message.randomID)}
        />
      </div>
    </div>
  );
}
