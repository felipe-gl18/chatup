import { Socket } from "socket.io-client";

export default async function makeCall(socket: Socket) {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const peerConnection = new RTCPeerConnection(configuration);

  // Listen for local ICE candidates on the local RTCPeerConnection
  peerConnection.addEventListener("icecandidate", (event) => {
    if (event.candidate) {
      socket.emit("new-ice-candidate", event.candidate);
    }
  });

  peerConnection.addEventListener("connectionstatechange", (event: unknown) => {
    if (peerConnection.connectionState === "connected") {
      console.log("worked", event);
    }
  });

  socket.on("makeCall", async (message) => {
    if (message.answer) {
      const remoteDesc = new RTCSessionDescription(message.answer);
      await peerConnection.setRemoteDescription(remoteDesc);
    }
    if (message.iceCandidate) {
      try {
        await peerConnection.addIceCandidate(message.iceCandidate);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    }
  });
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
}
