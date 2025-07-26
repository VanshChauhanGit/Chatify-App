import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn of listening to this event
    socket.off("testSocket", payload);
  } else if (typeof payload == "function") {
    // payload as callback for this event
    socket.on("testSocket", payload);
  } else {
    socket.emit("testSocket", payload); // sending payload as data
  }
};
