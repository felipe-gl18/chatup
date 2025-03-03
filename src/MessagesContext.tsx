import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";
import { Contact } from "./ContactsContext";

export type File = {
  name: string;
  preview: string;
  content: string;
};

export type Image = {
  name: string;
  content: string;
};

export type Message = {
  sender: string;
  randomID: number;
  text: string;
  audio: string;
  image: Image;
  file: File;
};

export type MessagesState = {
  [phonenumber: string]: Message[];
};

type MessagesContextType = {
  messages: MessagesState | null;
  setMessages: Dispatch<SetStateAction<MessagesState | null>>;
  isReceivingCall: boolean;
  setIsReceivingCall: Dispatch<SetStateAction<boolean>>;
  isRequestingCall: boolean;
  setIsRequestingCall: Dispatch<SetStateAction<boolean>>;
  currentCallingType: "voice" | "video";
  setCurrentCallingType: Dispatch<SetStateAction<"voice" | "video">>;
  isOnACall: boolean;
  setIsOnACall: Dispatch<SetStateAction<boolean>>;
  localVideoRef: MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: MutableRefObject<HTMLVideoElement | null>;
  handleSendMessage: (message: Message) => void;
  handleDeleteMessage: (messageID: number) => void;
  handleRequestCall: (type: "voice" | "video", receiver: Contact) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messages: { "": [] },
  setMessages: () => {},
  isReceivingCall: false,
  setIsReceivingCall: () => {},
  isRequestingCall: false,
  setIsRequestingCall: () => {},
  currentCallingType: "voice",
  setCurrentCallingType: () => {},
  isOnACall: false,
  setIsOnACall: () => {},
  localVideoRef: { current: null },
  remoteVideoRef: { current: null },
  handleSendMessage: () => {},
  handleDeleteMessage: () => {},
  handleRequestCall: () => {},
});
