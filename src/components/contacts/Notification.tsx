export default function Notification({ text }: { text: string }) {
  return (
    text && (
      <div className="flex">
        <p className="text-xs max-w-[200px] py-2 truncate whitespace-nowrap overflow-hidden">
          {text}
        </p>
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
        </span>
      </div>
    )
  );
}
