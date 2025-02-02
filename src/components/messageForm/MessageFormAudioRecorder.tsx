import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Message } from "../../MainContext";
import { MicIcon, PauseIcon, TrashIcon } from "lucide-react";

export default function MessageFormAudioRecorder({
  message,
  setMessage,
}: {
  message: Message;
  setMessage: Dispatch<SetStateAction<Message>>;
}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setIsRecording(true);
        mediaRecorderRef.current.ondataavailable = (event) => {
          const blob = new Blob([event.data], {
            type: "audio/webm; codecs=opus",
          });
          setMessage((previousMessage) => {
            return { ...previousMessage, audio: URL.createObjectURL(blob) };
          });
        };
      })
      .catch((error) => {
        console.log(`Error accessing the mic: `, error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      setIsRecording(false);
    }
  };

  const handleDeleteRecordedAudio = () => {
    setMessage((previousMessage) => {
      return { ...previousMessage, audio: "" };
    });
  };

  return (
    <div className="flex justify-center items-center">
      {!isRecording ? (
        <div
          onClick={handleStartRecording}
          className="text-white bg-slate-400 p-2 rounded-full cursor-pointer transition duration-300 hover:bg-slate-700 hover:text-white"
        >
          <MicIcon />
        </div>
      ) : (
        <div
          onClick={handleStopRecording}
          className="text-white bg-slate-400 p-2 rounded-full cursor-pointer transition duration-300 hover:bg-slate-700 hover:text-white"
        >
          <PauseIcon />
        </div>
      )}
      {message.audio && (
        <div className="flex items-center gap-2">
          <audio controls src={message.audio}></audio>
          <div
            onClick={handleDeleteRecordedAudio}
            className="p-2 rounded-full cursor-pointer transition duration-300 hover:bg-red-400 hover:text-white"
          >
            <TrashIcon />
          </div>
        </div>
      )}
    </div>
  );
}
