import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import { Message } from "../../MessagesContext";

export default function MessageFormInput({
  messageInputRef,
  message,
  setMessage,
}: {
  messageInputRef: RefObject<HTMLInputElement>;
  message: Message;
  setMessage: Dispatch<SetStateAction<Message>>;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage((previousMessage) => {
      return { ...previousMessage, text: event.target.value };
    });
  };
  return (
    <input
      ref={messageInputRef}
      value={message.text}
      onChange={handleChange}
      className="w-full bg-transparent outline-0"
      placeholder="Type a message here!"
      type="text"
      name=""
      id=""
    />
  );
}
