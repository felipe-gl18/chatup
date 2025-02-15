import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import Authentication from "./components/auth/Authentication";
import { Message, MessagesContext, MessagesState } from "./MessagesContext";
import { UserContext } from "./UserContext";
import { ContactsContext } from "./ContactsContext";

export function MessagesProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(
    new Audio("../../audiosEffect/messageNotification.mp3")
  );

  const { user, socket } = useContext(UserContext);
  const { setNotifications, selectedContact } = useContext(ContactsContext);

  const [messages, setMessages] = useState<MessagesState | null>(null);
  const [isVoiceCalling, setIsVoiceCalling] = useState<boolean>(false);
  const [isVideoCalling, setIsVideoCalling] = useState<boolean>(false);

  const handleSendMessage = (message: Message) => {
    setMessages((previousMessages) => {
      if (previousMessages) {
        return {
          ...previousMessages,
          [selectedContact!.phonenumber]: [
            ...(previousMessages[selectedContact!.phonenumber] || []),
            { ...message, sender: user!.phonenumber },
          ],
        };
      }
      return {
        [selectedContact!.phonenumber]: [
          { ...message, sender: user!.phonenumber },
        ],
      };
    });
    socket!.emit("sendMessage", {
      sender: user!.phonenumber,
      receiver: selectedContact!.phonenumber,
      message,
    });
  };

  const handleDeleteMessage = (
    messageID: number,
    phonenumber: string = selectedContact!.phonenumber
  ) => {
    const updatedMessages = messages![phonenumber].filter(
      (msg) => msg.randomID !== messageID
    );

    setMessages((previousMessages) => ({
      ...previousMessages,
      [phonenumber]: updatedMessages,
    }));

    socket!.emit("deleteMessage", {
      sender: user!.phonenumber,
      receiver: phonenumber,
      messageID,
    });
  };

  useEffect(() => {
    if (user && socket) {
      socket.on("newMessage", ({ sender, message }) => {
        const audio = audioRef.current;
        audio.play();
        if (selectedContact?.phonenumber !== sender) {
          setNotifications((previousNotifications) => {
            return {
              ...previousNotifications,
              [sender]: { text: message.text },
            };
          });
        }

        setMessages((previousMessages) => {
          if (previousMessages) {
            return {
              ...previousMessages,
              [sender]: [
                ...(previousMessages[sender] || []),
                { ...message, sender },
              ],
            };
          }
          return {
            [sender]: [{ ...message, sender }],
          };
        });
      });

      socket.on("deleteMessage", ({ sender, messageID }) => {
        setMessages((previousMessages) => {
          const updatedMessages = previousMessages![sender].filter(
            (msg) => msg.randomID !== messageID
          );

          return {
            ...previousMessages,
            [sender]: updatedMessages,
          };
        });
      });

      return () => {
        socket.off("newMessage");
        socket.off("deleteMessage");
      };
    }
  }, [user, socket, selectedContact]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        setMessages,
        isVoiceCalling,
        setIsVoiceCalling,
        isVideoCalling,
        setIsVideoCalling,
        handleSendMessage,
        handleDeleteMessage,
      }}
    >
      {user ? (
        <div className="flex w-screen">{children}</div>
      ) : (
        <div className="flex items-center justify-center w-screen">
          <Authentication />
        </div>
      )}
    </MessagesContext.Provider>
  );
}
