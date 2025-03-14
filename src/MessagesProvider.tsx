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

const peerConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export function MessagesProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(
    new Audio("../../audiosEffect/messageNotification.mp3")
  );

  const { user, socket } = useContext(UserContext);
  const { setNotifications, selectedContact, setSelectedContact } =
    useContext(ContactsContext);

  const localStreamRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(
    null
  );
  const remoteStreamRef = useRef<HTMLVideoElement | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);

  const [messages, setMessages] = useState<MessagesState | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>(null);

  const [currentCallingType, setCurrentCallingType] =
    useState<CallType>("voice");

  const handleRequestCall = (type: CallType, receiver: Contact) => {
    setCallStatus("requesting");
    socket!.emit("request_call", {
      requester: user,
      receiver: receiver!.token,
      type,
    });
  };

  const handleMakeCall = async (type: CallType) => {
    peerRef.current = new RTCPeerConnection(peerConfig);

    setupPeerListeners(peerRef.current, selectedContact!.token);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: type == "video" ? true : false,
      audio: true,
    });

    if (localStreamRef.current) localStreamRef.current.srcObject = stream;

    stream
      .getTracks()
      .forEach((track) => peerRef.current?.addTrack(track, stream));

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socket!.emit("offer", {
      target: selectedContact!.token,
      from: user!.token,
      sdp: peerRef.current.localDescription,
      type,
    });
  };

  const setupPeerListeners = (peer: RTCPeerConnection, target: string) => {
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", { target, candidate: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      if (remoteStreamRef.current)
        remoteStreamRef.current.srcObject = event.streams[0];
    };
  };

  const handleSendMessage = (message: Message) => {
    setMessages((previousMessages) => {
      if (previousMessages) {
        return {
          ...previousMessages,
          [selectedContact!.token]: [
            ...(previousMessages[selectedContact!.token] || []),
            { ...message, sender: user!.token },
          ],
        };
      }
      return {
        [selectedContact!.token]: [{ ...message, sender: user!.token }],
      };
    });
    socket!.emit("sendMessage", {
      sender: user!.token,
      receiver: selectedContact!.token,
      message,
    });
  };

  const handleDeleteMessage = (
    UUID: string,
    token: string = selectedContact!.token
  ) => {
    const updatedMessages = messages![token].filter((msg) => msg.UUID !== UUID);

    setMessages((previousMessages) => ({
      ...previousMessages,
      [token]: updatedMessages,
    }));

    socket!.emit("deleteMessage", {
      sender: user!.token,
      receiver: token,
      UUID,
    });
  };

  useEffect(
    () =>
      console.log(
        localStreamRef.current?.srcObject,
        remoteStreamRef.current?.srcObject
      ),
    [localStreamRef, remoteStreamRef]
  );

  useEffect(() => {
    if (user && socket) {
      socket.on("newMessage", ({ sender, message }) => {
        const audio = audioRef.current;
        audio.play();
        if (selectedContact?.token !== sender) {
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

      socket.on("deleteMessage", ({ sender, UUID }) => {
        setMessages((previousMessages) => {
          const updatedMessages = previousMessages![sender].filter(
            (msg) => msg.UUID !== UUID
          );

          return {
            ...previousMessages,
            [sender]: updatedMessages,
          };
        });
      });

      socket.on("receive_call", ({ requester, type }) => {
        setCurrentCallingType(type);
        if (callStatus == "calling" || callStatus == "requesting") {
          socket!.emit("request_call_rejected", {
            requester: requester.token,
          });
        } else {
          setSelectedContact(requester);
          setCallStatus("receiving");
        }
      });

      socket.on("request_call_rejected", () => {
        setCallStatus(null);
      });

      socket.on("request_call_accepted", async ({ type }) => {
        setCallStatus("calling");
        await handleMakeCall(type);
        setCurrentCallingType(type);
      });

      socket.on("finish_call", () => {
        setCallStatus(null);
        const localStream = localStreamRef.current?.srcObject as MediaStream;
        if (localStream)
          localStream.getTracks().forEach((track) => track.stop());
      });

      socket.on("offer", async ({ sdp, from, type }) => {
        peerRef.current = new RTCPeerConnection(peerConfig);
        peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        setupPeerListeners(peerRef.current, from);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: type == "video" ? true : false,
          audio: true,
        });
        stream
          .getTracks()
          .forEach((track) => peerRef.current?.addTrack(track, stream));

        if (localStreamRef.current) localStreamRef.current.srcObject = stream;

        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        socket.emit("answer", {
          target: from,
          sdp: peerRef.current.localDescription,
        });
      });

      socket.on("answer", ({ sdp }) => {
        peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
      });

      socket.on("ice-candidate", (candidate) => {
        peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
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
    }
  }, [user, socket, selectedContact]);

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
