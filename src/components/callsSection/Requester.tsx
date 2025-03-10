import { UserIcon } from "lucide-react";

export default function Requester() {
  return (
    <div className="absolute flex flex-col gap-8 justify-center items-center w-screen h-screen bg-slate-700">
      <div className="p-6 rounded-full bg-white text-black shadow-lg">
        <UserIcon />
      </div>
      <div className="flex gap-2">
        <div
          className="animate-bounce h-[8px] w-[8px] rounded-full bg-slate-400"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="animate-bounce h-[8px] w-[8px] rounded-full bg-slate-400"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="animate-bounce h-[8px] w-[8px] rounded-full bg-slate-400"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
}
