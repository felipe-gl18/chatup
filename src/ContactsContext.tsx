import { createContext, Dispatch, SetStateAction } from "react";

export type Contact = {
  name: string;
  phonenumber: string;
  img: string;
};

export type Notification = {
  text: string;
};

type ContactsContextType = {
  contacts: { [key: string]: Contact } | null;
  setContacts: Dispatch<SetStateAction<{ [key: string]: Contact } | null>>;
  notifications: { [key: string]: Notification } | null;
  setNotifications: Dispatch<
    SetStateAction<{ [key: string]: Notification } | null>
  >;
  handleDeleteContact: (deletedUserPhonenumber: string) => void;
  selectedContact: Contact | null;
  setSelectedContact: Dispatch<SetStateAction<Contact | null>>;
};

export const ContactsContext = createContext<ContactsContextType>({
  contacts: null,
  setContacts: () => {},
  notifications: null,
  setNotifications: () => {},
  handleDeleteContact: () => {},
  selectedContact: null,
  setSelectedContact: () => {},
});
