import { createContext, Dispatch, SetStateAction } from "react";

export type Contact = {
  username: string;
  email: string;
  token: string;
};

export type Notification = {
  text: string;
};

type ContactsContextType = {
  contacts: { [key: string]: Contact } | null;
  setContacts: Dispatch<SetStateAction<{ [key: string]: Contact } | null>>;
  handleDeleteContact: (deletedUserPhonenumber: string) => void;
  selectedContact: Contact | null;
  setSelectedContact: Dispatch<SetStateAction<Contact | null>>;
};

export const ContactsContext = createContext<ContactsContextType>({
  contacts: null,
  setContacts: () => {},
  handleDeleteContact: () => {},
  selectedContact: null,
  setSelectedContact: () => {},
});
