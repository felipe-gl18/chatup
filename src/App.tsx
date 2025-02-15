import "./App.css";
import Messages from "./components/messages/Messages";
import Contacts from "./components/contacts/Contacts";
import { MessagesProvider } from "./MessagesProvider";
import CallsSection from "./components/callsSection/CallsSection";
import { UserProvider } from "./UserProvider";
import ContactsProvider from "./ContactsProvider";
function App() {
  return (
    <UserProvider>
      <ContactsProvider>
        <MessagesProvider>
          <Contacts />
          <Messages />
          <CallsSection />
        </MessagesProvider>
      </ContactsProvider>
    </UserProvider>
  );
}

export default App;
