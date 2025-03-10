import { PhoneIcon, PhoneOffIcon, UserIcon } from "lucide-react";
import { useContext } from "react";
import { MessagesContext } from "../../MessagesContext";
import { Contact } from "../../ContactsContext";
import { UserContext } from "../../UserContext";

export default function Receiver({ requester }: { requester: Contact }) {
  const { socket } = useContext(UserContext);
  const { setIsReceivingCall, setCurrentCallingType, setIsOnACall } =
    useContext(MessagesContext);

  const handleAcceptCall = () => {
    setIsReceivingCall(false);
    setIsOnACall(true);
    socket!.emit("request_call_accepted", {
      requesterToken: requester.token,
    });
  };

  const handleRejectCall = () => {
    setIsReceivingCall(false);
    setCurrentCallingType("voice");
    socket!.emit("request_call_rejected", {
      requesterToken: requester.token,
    });
  };

  return (
    <div className="absolute flex flex-col justify-center items-center w-screen h-screen bg-slate-700">
      <div className="p-6 rounded-full bg-white text-black shadow-lg">
        <UserIcon />
      </div>
      <div className="flex gap-8 py-6">
        <div
          onClick={handleAcceptCall}
          className="bg-green-400 text-white cursor-pointer rounded-full w-min p-4 transition duration-300 hover:bg-green-300"
        >
          <PhoneIcon />
        </div>
        <div
          onClick={handleRejectCall}
          className="bg-red-400 text-white cursor-pointer rounded-full w-min p-4 transition duration-300 hover:bg-red-300"
        >
          <PhoneOffIcon />
        </div>
      </div>
    </div>
  );
}
