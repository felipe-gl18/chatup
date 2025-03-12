import { DownloadIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { File } from "../../MessagesContext";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { arrayBufferToUrl } from "../../../util/arrayBufferToBlobURL";

export default function FileViewer({ file }: { file: File }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const blobURLFileContent = arrayBufferToUrl(file.content!, file.type);

  const memoizedFile = useMemo(
    () => ({ url: blobURLFileContent }),
    [blobURLFileContent]
  );

  const handleViewerToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = blobURLFileContent;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Document file={memoizedFile} onClick={handleViewerToggle}>
        <div className="h-[200px] overflow-hidden rounded-md rounded-tl-none cursor-pointer transition duration-300 hover:opacity-70">
          <Page pageNumber={1} width={400} />
        </div>
      </Document>
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
              <iframe src={blobURLFileContent} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
