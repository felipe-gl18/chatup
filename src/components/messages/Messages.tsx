import { useContext } from "react";
import NoMessagesFound from "./NoMessagesFound";
import { MainContext } from "../../MainContext";
import CurrentMessageReciever from "./CurrentMessageReciever";
import MessageForm from "../messageForm/MessageForm";
import Message from "./Message";

export default function Messages() {
  const { messages, currentReciever } = useContext(MainContext);
  return (
    <div className="w-4/6 h-screen justify-between flex flex-col">
      <CurrentMessageReciever />
      {!messages[currentReciever.phonenumber] ||
      messages[currentReciever.phonenumber]?.length == 0 ? (
        <div className="flex justify-center items-center w-full">
          <NoMessagesFound />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full gap-4 overflow-auto p-4">
          {messages[currentReciever.phonenumber].map((message) => (
            <Message
              message={message}
              key={`${currentReciever}-${message.randomID}`}
            />
          ))}
        </div>
      )}
      <MessageForm />
    </div>
  );
}
