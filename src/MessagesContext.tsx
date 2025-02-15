import { createContext, Dispatch, SetStateAction } from "react";

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
  isVoiceCalling: boolean;
  setIsVoiceCalling: Dispatch<SetStateAction<boolean>>;
  isVideoCalling: boolean;
  setIsVideoCalling: Dispatch<SetStateAction<boolean>>;
  handleSendMessage: (message: Message) => void;
  handleDeleteMessage: (messageID: number) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messages: { "": [] },
  setMessages: () => {},
  isVoiceCalling: false,
  setIsVoiceCalling: () => {},
  isVideoCalling: false,
  setIsVideoCalling: () => {},
  handleSendMessage: () => {},
  handleDeleteMessage: () => {},
});
