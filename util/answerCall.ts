import { Socket } from "socket.io-client";

export default async function answerCall(socket: Socket) {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const peerConnection = new RTCPeerConnection(configuration);

  peerConnection.addEventListener("track", async (event) => {
    const [remoteStream] = event.streams;
    console.log(remoteStream);
  });

  socket.on("new-ice-candidate", async (candidate) => {
    try {
      await peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error("Erro ao adicionar ICE candidate recebido", error);
    }
  });

  socket.on("makeCall", async (message) => {
    console.log(message);
    if (message.type == "offer") {
      peerConnection.setRemoteDescription(new RTCSessionDescription(message));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", answer);
    }
  });
}
