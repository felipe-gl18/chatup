import { CallType } from "../src/MessagesContext";
export const getUserMedia = async (type: CallType) => {
  return await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: type == "video" ? true : false,
  });
};
