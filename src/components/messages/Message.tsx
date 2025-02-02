import { TrashIcon } from "lucide-react";
import { MainContext, Message as MessageType } from "../../MainContext";
import { useContext } from "react";
import ImageViewer from "./ImageViewer";
import FileViewer from "./FileViewer";

export default function Message({ message }: { message: MessageType }) {
  const { messages, setMessages, currentReciever } = useContext(MainContext);

  const handleDeleteMessage = () => {
    const currentPhoneNumber = currentReciever.phonenumber;

    const updatedMessages = messages[currentPhoneNumber].filter(
      (msg) => msg.randomID !== message.randomID
    );

    setMessages((previousMessages) => ({
      ...previousMessages,
      [currentPhoneNumber]: updatedMessages,
    }));
  };

  return (
    <div className="group w-max max-w-[360px] space-y-2">
      <div className="flex flex-col gap-4 p-4 rounded-b-2xl rounded-tr-2xl bg-slate-700 text-white">
        {message.text == "" ? null : (
          <p className="break-normal">{message.text}</p>
        )}
        {message.file == "" ? null : <FileViewer file={message.file} />}
        {message.image == "" ? null : <ImageViewer image={message.image} />}
        {message.audio == "" ? null : (
          <audio src={message.audio} controls className="max-w-[360px]"></audio>
        )}
      </div>
      <div className="hidden group-hover:flex cursor-pointer text-red-400">
        <TrashIcon size={18} onClick={handleDeleteMessage} />
      </div>
    </div>
  );
}
