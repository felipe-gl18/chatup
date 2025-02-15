import { FormEvent, useContext, useRef, useState } from "react";
import MessageFormInput from "./MessageFormInput";
import MessageFormAudioRecorder from "./MessageFormAudioRecorder";
import MessageFormImageUpload from "./MessageFormImageUpload";
import MessageFormFileUpload from "./MessageFormFileUpload";
import { Message, MessagesContext } from "../../MessagesContext";

export default function MessageForm() {
  const { handleSendMessage } = useContext(MessagesContext);

  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleRandomID = () => Math.random() * 100;

  const [message, setMessage] = useState<Message>({
    randomID: handleRandomID(),
    text: "",
    audio: "",
    image: {
      name: "",
      content: "",
    },
    file: {
      name: "",
      preview: "",
      content: "",
    },
  });

  const handleFormClick = () => {
    if (!messageInputRef.current) return;
    messageInputRef.current.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendMessage(message);
    setMessage({
      text: "",
      audio: "",
      image: {
        name: "",
        content: "",
      },
      file: {
        name: "",
        preview: "",
        content: "",
      },
      randomID: handleRandomID(),
    });
  };

  return (
    <div className="w-full bg-slate-100">
      <form
        className="bottom-4 flex justify-between items-center w-full p-4 gap-4 rounded-md "
        onClick={handleFormClick}
        onSubmit={handleSubmit}
        action=""
      >
        <MessageFormInput
          messageInputRef={messageInputRef}
          message={message}
          setMessage={setMessage}
        />
        <div className="flex gap-4">
          <MessageFormAudioRecorder message={message} setMessage={setMessage} />
          <MessageFormImageUpload setMessage={setMessage} />
          <MessageFormFileUpload setMessage={setMessage} />
        </div>
      </form>
    </div>
  );
}
