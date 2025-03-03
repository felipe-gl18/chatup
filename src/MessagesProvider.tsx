import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import Authentication from "./components/auth/Authentication";
import { Message, MessagesContext, MessagesState } from "./MessagesContext";
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

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);

  const [messages, setMessages] = useState<MessagesState | null>(null);
  const [isRequestingCall, setIsRequestingCall] = useState<boolean>(false);
  const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false);
  const [currentCallingType, setCurrentCallingType] = useState<
    "voice" | "video"
  >("voice");

  const [isOnACall, setIsOnACall] = useState<boolean>(false);

  const handleRequestCall = (type: "voice" | "video", receiver: Contact) => {
    setIsRequestingCall(true);
    setCurrentCallingType(type);
    socket!.emit("request_call", {
      requester: user,
      receiver: receiver!.phonenumber,
      type,
    });
  };

  const handleMakeCall = async () => {
    peerRef.current = new RTCPeerConnection(peerConfig);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: currentCallingType == "video" ? true : false,
      audio: true,
    });
    stream
      .getTracks()
      .forEach((track) => peerRef.current?.addTrack(track, stream));

    if (currentCallingType == "video") {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } else {
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
    }

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socket!.emit("offer", {
      target: selectedContact!.phonenumber,
      sdp: peerRef.current.localDescription,
    });
    setupPeerListeners(peerRef.current, selectedContact!.phonenumber);
  };

  const setupPeerListeners = (peer: RTCPeerConnection, target: string) => {
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", { target, candidate: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      if (currentCallingType == "video") {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      } else {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      }
    };
  };

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

      socket.on("receive_call", ({ requester, type }) => {
        if (isRequestingCall || isOnACall) {
          socket!.emit("request_call_rejected", {
            requester: requester.phonenumber,
          });
        } else {
          setSelectedContact(requester);
          setCurrentCallingType(type);
          setIsReceivingCall(true);
        }
      });

      socket.on("request_call_rejected", () => {
        setIsRequestingCall(false);
        setCurrentCallingType("voice");
      });

      socket.on("request_call_accepted", async () => {
        setIsRequestingCall(false);
        setIsOnACall(true);
        await handleMakeCall();
      });

      socket.on("finish_call", () => {
        setIsOnACall(false);
        if (currentCallingType == "video") {
          const localStream = localVideoRef.current?.srcObject as MediaStream;
          if (localStream)
            localStream.getTracks().forEach((track) => track.stop());
        } else {
          const localStream = localAudioRef.current?.srcObject as MediaStream;
          if (localStream)
            localStream.getTracks().forEach((track) => track.stop());
        }
        setCurrentCallingType("voice");
      });

      socket.on("offer", async ({ sdp, from }) => {
        peerRef.current = new RTCPeerConnection(peerConfig);
        peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        setupPeerListeners(peerRef.current, from);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: currentCallingType == "video" ? true : false,
          audio: true,
        });
        stream
          .getTracks()
          .forEach((track) => peerRef.current?.addTrack(track, stream));

        if (currentCallingType == "video") {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          if (localAudioRef.current) {
            localAudioRef.current.srcObject = stream;
          }
        }

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
        isReceivingCall,
        setIsReceivingCall,
        isRequestingCall,
        setIsRequestingCall,
        currentCallingType,
        setCurrentCallingType,
        localVideoRef,
        remoteVideoRef,
        localAudioRef,
        remoteAudioRef,
        isOnACall,
        setIsOnACall,
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
