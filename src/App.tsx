import "./App.css";
import Messages from "./components/messages/Messages";
import Contacts from "./components/contacts/Contacts";
import { MainProvider } from "./MainContext";
import CallsSection from "./components/callsSection/CallsSection";
function App() {
  return (
    <MainProvider>
      <Contacts />
      <Messages />
      <CallsSection />
    </MainProvider>
  );
}

export default App;
