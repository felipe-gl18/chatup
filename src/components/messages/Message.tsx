import { TrashIcon } from "lucide-react";
import { MessagesContext, Message as MessageType } from "../../MessagesContext";
import { useContext } from "react";
import ImageViewer from "./ImageViewer";
import FileViewer from "./FileViewer";
import { UserContext } from "../../UserContext";

export default function Message({
  message,
  accessToken,
}: {
  message: MessageType;
  accessToken: string;
}) {
  const { user } = useContext(UserContext);
  const { handleDeleteMessage } = useContext(MessagesContext);

  const getAudioSrc = () => {
    if (!message.audio?.content) return "";
    const blob = new Blob([message.audio.content], {
      type: message.audio.type,
    });
    return URL.createObjectURL(blob);
  };

  const isSender = message.sender == user!.token;

  const messageContainerStyles = {
    receiver: "items-end",
    sender: "items-start",
  };

  const messageContentStyles = {
    sender: "bg-slate-700 text-white",
    receiver: "bg-gray-200 text-black",
  };

  return (
    <div
      className={`group w-full space-y-2 flex flex-col ${
        isSender
          ? messageContainerStyles.sender
          : messageContainerStyles.receiver
      }`}
    >
      <div
        className={`flex w-max max-w-[300px]  flex-col gap-4 p-4 rounded-b-2xl rounded-tr-2xl ${
          isSender ? messageContentStyles.sender : messageContentStyles.receiver
        }`}
      >
        {message.file && <FileViewer file={message.file} />}
        {message.image && <ImageViewer image={message.image} />}
        {message.text && <p className="break-normal">{message.text}</p>}
        {message.audio && (
          <audio
            src={getAudioSrc()}
            controls
            className="min-w-[250px] w-full"
          ></audio>
        )}
      </div>
      <div className={`hidden group-hover:flex cursor-pointer text-red-400`}>
        <TrashIcon
          size={18}
          onClick={() => handleDeleteMessage(message.UUID!, accessToken)}
        />
      </div>
    </div>
  );
}
