import { Contact as ContactType } from "../../UserContext";
import Contact from "./Contact";

export default function ContactsList({
  contacts,
}: {
  contacts: ContactType[];
}) {
  return contacts.map((contact) => (
    <Contact contact={contact} key={contact.phonenumber} />
  ));
}
