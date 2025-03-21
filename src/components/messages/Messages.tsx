import { useContext } from "react";
import { MessagesContext } from "../../MessagesContext";
import CurrentMessageReciever from "./SelectedContact";
import MessageForm from "../messageForm/MessageForm";
import Message from "./Message";
import CurrentReceiverNotFound from "./SelectedContactNotFound";
import { ContactsContext } from "../../ContactsContext";
import { UserContext } from "../../UserContext";

export default function Messages() {
  const { user } = useContext(UserContext);
  const { selectedContact } = useContext(ContactsContext);
  const { messages } = useContext(MessagesContext);
  const messagesAccessToken = [user!.token, selectedContact?.token]
    .sort()
    .join("|");

  return (
    <div
      className={`md:w-4/6 w-full h-screen justify-between ${
        selectedContact ? "flex" : "hidden"
      }  lg:flex flex-col`}
    >
      {selectedContact ? (
        <>
          <CurrentMessageReciever />
          {messages?.[messagesAccessToken] && (
            <div className="relative h-full p-4 space-y-4 overflow-y-auto">
              {messages[messagesAccessToken].map((message) => (
                <Message
                  message={message}
                  key={message.UUID}
                  accessToken={messagesAccessToken}
                />
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
