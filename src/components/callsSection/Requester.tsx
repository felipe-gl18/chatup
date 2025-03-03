import { Contact } from "../../ContactsContext";

export default function Requester({ receiver }: { receiver: Contact }) {
  return (
    <div className="absolute flex flex-col gap-8 justify-center items-center w-screen h-screen bg-slate-700">
      <div
        className={`flex-shrink-0 w-[162px] h-[162px] rounded-full`}
        style={{
          backgroundImage: `url(${receiver!.img})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          imageRendering: "auto",
        }}
      ></div>
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
