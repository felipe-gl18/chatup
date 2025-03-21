import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { Message } from "../../MessagesContext";
import { FileIcon } from "lucide-react";

export default function MessageFormFileUpload({
  setMessage,
}: {
  setMessage: Dispatch<SetStateAction<Message>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setMessage((previousMessage) => {
        return {
          ...previousMessage,
          file: {
            name: file.name,
            preview: reader.result as ArrayBuffer,
            content: reader.result as ArrayBuffer,
            type: file.type,
          },
        };
      });
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center">
      <input
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        type="file"
        name=""
        id=""
        accept=".xls, .xlsx, .pdf, .docx, .doc, .txt"
      />
      <div
        className="text-white bg-slate-400 p-2 rounded-full cursor-pointer transition duration-300 hover:bg-slate-700 hover:text-white"
        onClick={handleIconClick}
      >
        <FileIcon />
      </div>
    </div>
  );
}
