import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Contact, contacts as contactsList } from "../util/contacts";

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
  randomID: number;
  text: string;
  audio: string;
  image: Image;
  file: File;
};

export type MessagesState = {
  [phonenumber: string]: Message[];
};

type MainContextType = {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  messages: MessagesState;
  setMessages: Dispatch<SetStateAction<MessagesState>>;
  currentReciever: Contact;
  setCurrentReciever: Dispatch<SetStateAction<Contact>>;
  isVoiceCalling: boolean;
  setIsVoiceCalling: Dispatch<SetStateAction<boolean>>;
  isVideoCalling: boolean;
  setIsVideoCalling: Dispatch<SetStateAction<boolean>>;
};

export const MainContext = createContext<MainContextType>({
  contacts: contactsList,
  setContacts: () => {},
  messages: { "": [] },
  setMessages: () => {},
  currentReciever: { img: "", name: "", phonenumber: "" },
  setCurrentReciever: () => {},
  isVoiceCalling: false,
  setIsVoiceCalling: () => {},
  isVideoCalling: false,
  setIsVideoCalling: () => {},
});

export function MainProvider({ children }: { children: ReactNode }) {
  const defaultCurrentReciver = contactsList[0];
  const [contacts, setContacts] = useState<Contact[]>(contactsList);
  const [messages, setMessages] = useState<MessagesState>({
    [defaultCurrentReciver.phonenumber]: [],
  });
  const [currentReciever, setCurrentReciever] = useState(defaultCurrentReciver);
  const [isVoiceCalling, setIsVoiceCalling] = useState<boolean>(false);
  const [isVideoCalling, setIsVideoCalling] = useState<boolean>(false);
  return (
    <MainContext.Provider
      value={{
        contacts,
        setContacts,
        messages,
        setMessages,
        currentReciever,
        setCurrentReciever,
        isVoiceCalling,
        setIsVoiceCalling,
        isVideoCalling,
        setIsVideoCalling,
      }}
    >
      <div className="flex w-screen">{children}</div>
    </MainContext.Provider>
  );
}
