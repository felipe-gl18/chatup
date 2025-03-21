import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Message } from "../../MessagesContext";
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
        mediaRecorderRef.current.ondataavailable = async (event) => {
          const blob = new Blob([event.data], {
            type: "audio/webm; codesc=opus",
          });
          const arrayBuffer = await blob.arrayBuffer();

          setMessage((previousMessage) => ({
            ...previousMessage,
            audio: {
              name: `recording-${Date.now()}.webm`,
              content: arrayBuffer,
              type: blob.type,
            },
          }));
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
      return { ...previousMessage, audio: undefined };
    });
  };

  const getAudioSrc = () => {
    if (!message.audio?.content) return "";
    const blob = new Blob([message.audio.content], {
      type: message.audio.type,
    });
    return URL.createObjectURL(blob);
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
          <audio controls src={getAudioSrc()} className="w-[100px]"></audio>
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
