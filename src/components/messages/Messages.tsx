import { useContext } from "react";
import { MessagesContext } from "../../MessagesContext";
import CurrentMessageReciever from "./SelectedContact";
import MessageForm from "../messageForm/MessageForm";
import Message from "./Message";
import CurrentReceiverNotFound from "./SelectedContactNotFound";
import { ContactsContext } from "../../ContactsContext";

export default function Messages() {
  const { selectedContact } = useContext(ContactsContext);
  const { messages } = useContext(MessagesContext);
  return (
    <div className="w-4/6 h-screen justify-between flex flex-col">
      {selectedContact ? (
        <>
          <CurrentMessageReciever />
          {messages?.[selectedContact.token] && (
            <div className="relative h-full p-4 space-y-4 overflow-y-auto">
              {messages[selectedContact.token].map((message) => (
                <Message message={message} key={message.randomID} />
              ))}
            </div>
          )}
          <MessageForm />
        </>
      ) : (
        <CurrentReceiverNotFound />
      )}
    </div>
  );
}
