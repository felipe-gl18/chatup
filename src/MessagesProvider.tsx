import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import Authentication from "./components/auth/Authentication";
import {
  CallStatus,
  CallType,
  Message,
  MessagesContext,
  MessagesState,
} from "./MessagesContext";
import { UserContext } from "./UserContext";
import { Contact, ContactsContext } from "./ContactsContext";
import { useWebRTC } from "./hooks/useWebRTC";

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user, socket } = useContext(UserContext);
  const { selectedContact, setSelectedContact } = useContext(ContactsContext);

  const [messages, setMessages] = useState<MessagesState | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>(null);
  const [currentCallingType, setCurrentCallingType] =
    useState<CallType>("voice");

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const { startCall, answerCall, addIceCandidate, endCall, handleAnswer } =
    useWebRTC(socket!, localStreamRef, remoteStreamRef);

  const handleRequestCall = (type: CallType, receiver: Contact) => {
    setSelectedContact(receiver);
    setCallStatus("requesting");
    setCurrentCallingType(type);
    socket!.emit("request_call", {
      requester: user,
      receiver: receiver!.token,
      type,
    });
  };

  const handleSendMessage = (message: Message) => {
    socket!.emit("sendMessage", {
      sender: user!.token,
      receiver: selectedContact!.token,
      message,
    });
  };

  const handleDeleteMessage = (
    UUID: string,
    accessToken: string = selectedContact!.token
  ) => {
    socket!.emit("deleteMessage", {
      requester: user!.token,
      receiver: selectedContact!.token,
      UUID,
      accessToken,
    });
  };

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("newMessage", (message) => {
      setMessages((prev) => ({
        ...(prev || {}),
        ...message,
      }));
    });

    socket.on("deleteMessage", ({ UUID, accessToken }) => {
      setMessages((prev) => {
        const updated = prev![accessToken].filter(
          (message) => message.UUID !== UUID
        );
        return { ...prev, [accessToken]: updated };
      });
    });

    socket.on("receive_call", ({ requester, type }) => {
      setCurrentCallingType(type);
      if (callStatus === "calling" || callStatus === "requesting") {
        socket!.emit("request_call_rejected", {
          requesterToken: requester.token,
        });
      } else {
        setSelectedContact(requester);
        setCallStatus("receiving");
      }
    });

    socket.on("request_call_rejected", () => setCallStatus(null));

    socket.on("request_call_accepted", async ({ type }) => {
      setCallStatus("calling");
      await startCall(type, selectedContact!.token);
    });

    socket.on("offer", async ({ sdp, from, type }) => {
      await answerCall(sdp, from, type);
    });

    socket.on("answer", async ({ sdp }) => {
      await handleAnswer(sdp);
    });

    socket.on("ice-candidate", async (candidate) => {
      await addIceCandidate(candidate);
    });

    socket.on("finish_call", () => {
      setCallStatus(null);
      endCall();
    });

    return () => {
      socket.off("newMessage");
      socket.off("deleteMessage");
      socket.off("receive_call");
      socket.off("request_call_rejected");
      socket.off("request_call_accepted");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [user, socket, selectedContact, callStatus]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        setMessages,
        currentCallingType,
        setCurrentCallingType,
        callStatus,
        setCallStatus,
        localStreamRef,
        remoteStreamRef,
        handleSendMessage,
        handleDeleteMessage,
        handleRequestCall,
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
