import { RefObject } from "react";

export async function startWebcam(videoRef: RefObject<HTMLVideoElement>) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (error) {
    console.log(`Error accessing webcam: `, error);
  }
}
