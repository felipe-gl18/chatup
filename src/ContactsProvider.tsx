import { ReactNode, useContext, useEffect, useState } from "react";
import { Contact, ContactsContext } from "./ContactsContext";
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

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        setContacts,
        handleDeleteContact,
        selectedContact,
        setSelectedContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}
