import { DownloadIcon, EyeIcon, XIcon } from "lucide-react";
import { useState } from "react";

export default function FileViewer({ file }: { file: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleViewerToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = "file.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div
        className="flex  gap-2 items-center p-2 bg-gray-400 rounded-full"
        onClick={handleViewerToggle}
      >
        <p className="font-bold text-xs">attached file</p>
        <EyeIcon size={14} />
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-10">
          <div className="relative flex flex-col items-center w-11/12 max-w-4xl max-h-[90vh] gap-4">
            <div className="w-full flex justify-end gap-4">
              <button
                onClick={handleDownloadFile}
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
            <div className="w-full h-screen">
              <iframe src={file} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
