import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";
import { Contact } from "./ContactsContext";

export type StreamRef = MutableRefObject<
  HTMLVideoElement | HTMLAudioElement | null
>;

export type CallType = "voice" | "video";

export type CallStatus = "requesting" | "receiving" | "calling" | null;

export type File = {
  name: string;
  content: ArrayBuffer | null;
  type: string;
};

export type Message = {
  UUID?: string;
  text?: string;
  audio?: File;
  image?: File;
  file?: File;
  sender?: string;
};

export type MessagesState = {
  [token: string]: Message[];
};

type MessagesContextType = {
  messages: MessagesState | null;
  setMessages: Dispatch<SetStateAction<MessagesState | null>>;
  currentCallingType: "voice" | "video";
  setCurrentCallingType: Dispatch<SetStateAction<"voice" | "video">>;
  callStatus: CallStatus;
  setCallStatus: Dispatch<SetStateAction<CallStatus>>;
  localStreamRef: StreamRef;
  remoteStreamRef: StreamRef;
  handleSendMessage: (message: Message) => void;
  handleDeleteMessage: (UUID: string, accessToken: string) => void;
  handleRequestCall: (type: "voice" | "video", receiver: Contact) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messages: { "": [] },
  setMessages: () => {},
  currentCallingType: "voice",
  setCurrentCallingType: () => {},
  callStatus: null,
  setCallStatus: () => {},
  localStreamRef: { current: null },
  remoteStreamRef: { current: null },
  handleSendMessage: () => {},
  handleDeleteMessage: () => {},
  handleRequestCall: () => {},
});
