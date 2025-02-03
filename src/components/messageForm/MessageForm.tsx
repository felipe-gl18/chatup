import { FormEvent, useContext, useRef, useState } from "react";
import MessageFormInput from "./MessageFormInput";
import { MainContext, Message } from "../../MainContext";
import MessageFormAudioRecorder from "./MessageFormAudioRecorder";
import MessageFormImageUpload from "./MessageFormImageUpload";
import MessageFormFileUpload from "./MessageFormFileUpload";

export default function MessageForm() {
  const { currentReciever, setMessages } = useContext(MainContext);

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
    if (message.text || message.audio || message.image || message.file)
      setMessages((previousMessages) => {
        return {
          ...previousMessages,
          [currentReciever.phonenumber]: [
            ...(previousMessages[currentReciever.phonenumber] || []),
            message,
          ],
        };
      });
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
