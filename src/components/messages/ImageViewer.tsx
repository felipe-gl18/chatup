import { DownloadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Image } from "../../MessagesContext";

import { arrayBufferToUrl } from "../../../util/arrayBufferToBlobURL";

export default function ImageViewer({ image }: { image: Image }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const blobURLImageContent = arrayBufferToUrl(image.content!, image.type);

  const handleViewerToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = blobURLImageContent;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <img
        className="cursor-pointer transition duration-300 rounded-md hover:opacity-70"
        src={blobURLImageContent}
        onClick={handleViewerToggle}
      />
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-10">
          <div className="relative flex flex-col items-center w-11/12 max-w-4xl max-h-[90vh] gap-4">
            <div className="w-full flex justify-end gap-4">
              <button
                onClick={handleDownloadImage}
                className="p-2 rounded-full bg-white text-black"
              >
                <DownloadIcon size={18} />
              </button>
              <button
                onClick={handleViewerToggle}
                className="p-2 rounded-full bg-white text-black"
              >
                <XIcon size={18} />
              </button>
            </div>
            <img
              className="max-w-full max-h-[80vh] object-contain shadow-md"
              src={blobURLImageContent}
            />
          </div>
        </div>
      )}
    </>
  );
}
