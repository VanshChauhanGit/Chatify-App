import { getSocket } from "./socket";

export const updateProfile = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn of listening to this event
    socket.off("updateProfile", payload);
  } else if (typeof payload == "function") {
    // payload as callback for this event
    socket.on("updateProfile", payload);
  } else {
    socket.emit("updateProfile", payload); // sending payload as data
  }
};
