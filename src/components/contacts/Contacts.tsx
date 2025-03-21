import { ChangeEvent, useContext, useState } from "react";
import ContactSearch from "./ContactSearch";
import ContactsList from "./ContactsList";
import Profile from "../Profile";
import { ContactsContext } from "../../ContactsContext";

export default function Contacts() {
  const { contacts, selectedContact } = useContext(ContactsContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleContactFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredContacts = searchTerm
    ? Object.values(contacts || {}).filter((contact) =>
        contact.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : Object.values(contacts || {});

  return (
    <div
      className={`w-full lg:w-2/6 flex-col ${
        selectedContact ? "hidden" : "flex"
      } md:flex h-screen bg-gray-700`}
    >
      <div className="flex justify-between px-4">
        <Profile />
        <ContactSearch handleContactFilter={handleContactFilter} />
      </div>
      <div className="overflow-auto space-y-4 py-6">
        {filteredContacts && <ContactsList contacts={filteredContacts} />}
      </div>
    </div>
  );
}
