import { RefObject } from "react";

export async function stopWebcam(videoRef: RefObject<HTMLVideoElement>) {
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    videoRef.current.srcObject = null;
  }
}
