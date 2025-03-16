import { ReactNode, useContext, useEffect, useState } from "react";
import { Contact, ContactsContext, Notification } from "./ContactsContext";
import { UserContext } from "./UserContext";

export default function ContactsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, socket } = useContext(UserContext);

  const [contacts, setContacts] = useState<{ [key: string]: Contact } | null>(
    null
  );
  const [notifications, setNotifications] = useState<{
    [key: string]: Notification;
  } | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleDeleteContact = (deletedUserToken: string) => {
    if (!socket) return;
    socket.emit("deleteUser", {
      deletingUserToken: user!.token,
      deletedUserToken,
    });
  };

  useEffect(() => {
    if (socket && user) {
      socket.on("disconnectedUser", () => {
        // emitting an event to get the users but the currently one when another user disconnect
        socket.emit("getUsers", user.token);
      });
      // listening the answer of the getUsers emitted event
      socket.on("users", (users) => {
        setContacts(users);
      });

      return () => {
        socket.off("disconnectedUser");
        socket.off("users");
      };
    }
  }, [user, socket]);

  useEffect(() => {
    if (!selectedContact) return;
    setNotifications((previousNotifications) => {
      if (!previousNotifications) return previousNotifications;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [selectedContact.token]: _, ...rest } = previousNotifications;
      return rest;
    });
  }, [selectedContact]);

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        setContacts,
        notifications,
        setNotifications,
        handleDeleteContact,
        selectedContact,
        setSelectedContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}
