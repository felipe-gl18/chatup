import { ChangeEvent, useContext, useState } from "react";
import Contact from "./Contact";
import ContactSearch from "./ContactSearch";
import { MainContext } from "../../MainContext";

export default function Contacts() {
  const { contacts } = useContext(MainContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = searchTerm
    ? contacts.filter((contact) => contact.name.includes(searchTerm))
    : contacts;

  const handleContactFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col w-2/6 h-screen bg-gray-700">
      <ContactSearch handleContactFilter={handleContactFilter} />
      <div className="overflow-auto space-y-4 py-6">
        {filteredContacts.map((contact) => (
          <Contact contact={contact} key={contact.phonenumber} />
        ))}
      </div>
    </div>
  );
}
