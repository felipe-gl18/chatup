import { useContext, useRef } from "react";
import { CallType, StreamRef } from "../MessagesContext";
import { getUserMedia } from "../../util/getUserMedia";
import { Socket } from "socket.io-client";
import { UserContext } from "../UserContext";

const peerConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export function useWebRTC(
  socket: Socket,
  localStreamRef: StreamRef,
  remoteStreamRef: StreamRef
) {
  const { user } = useContext(UserContext);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  const createPeerConnection = (target: string) => {
    const peer = new RTCPeerConnection(peerConfig);

    peer.onicecandidate = (event) => {
      if (event.candidate)
        socket.emit("ice-candidate", { target, candidate: event.candidate });
    };

    peer.ontrack = (event) => {
      if (remoteStreamRef.current)
        remoteStreamRef.current.srcObject = event.streams[0];
    };

    return peer;
  };

  const startCall = async (type: CallType, target: string) => {
    peerRef.current = createPeerConnection(target);
    const stream = await getUserMedia(type);
    stream
      .getTracks()
      .forEach((track) => peerRef.current?.addTrack(track, stream));

    if (localStreamRef.current) localStreamRef.current.srcObject = stream;

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socket.emit("offer", {
      target,
      sdp: peerRef.current.localDescription,
      from: user!.token,
      type,
    });
  };

  const answerCall = async (
    sdp: RTCSessionDescriptionInit,
    from: string,
    type: CallType
  ) => {
    peerRef.current = createPeerConnection(from);
    const stream = await getUserMedia(type);
    stream
      .getTracks()
      .forEach((track) => peerRef.current?.addTrack(track, stream));
    if (localStreamRef.current) localStreamRef.current.srcObject = stream;

    await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socket.emit("answer", {
      target: from,
      sdp: peerRef.current.localDescription,
    });
  };

  const handleAnswer = async (sdp: RTCSessionDescriptionInit) => {
    const remoteDesc = new RTCSessionDescription(sdp);
    await peerRef.current?.setRemoteDescription(remoteDesc);
  };

  const addIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (peerRef.current?.localDescription)
      await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const endCall = () => {
    const stream = localStreamRef.current?.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
    peerRef.current = null;
  };

  return {
    startCall,
    answerCall,
    addIceCandidate,
    endCall,
    handleAnswer,
  };
}
