import { ImageIcon } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { Message } from "../../MainContext";

export default function MessageFormImageUpload({
  setMessage,
}: {
  setMessage: Dispatch<SetStateAction<Message>>;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files;
    if (!images) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMessage((previousMessage) => {
        return { ...previousMessage, image: reader.result as string };
      });
    };
    reader.readAsDataURL(images[0]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="flex items-center">
      <input
        ref={imageInputRef}
        onChange={handleImageChange}
        className="hidden"
        type="file"
        name=""
        id=""
        accept="image/png, image/jpeg, image/jpg"
      />
      <div
        className="text-white bg-slate-400 p-2 rounded-full cursor-pointer transition duration-300 hover:bg-slate-700 hover:text-white"
        onClick={handleIconClick}
      >
        <ImageIcon />
      </div>
    </div>
  );
}
