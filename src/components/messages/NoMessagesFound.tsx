import { MessageCircleOffIcon } from "lucide-react";

export default function NoMessagesFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <p className="text-slate-400 font-black text-2xl">No messages found</p>
      <MessageCircleOffIcon size={36} />
    </div>
  );
}
