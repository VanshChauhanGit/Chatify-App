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

export const getContacts = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn of listening to this event
    socket.off("getContacts", payload);
  } else if (typeof payload == "function") {
    // payload as callback for this event
    socket.on("getContacts", payload);
  } else {
    socket.emit("getContacts", payload); // sending payload as data
  }
};

export const newConversation = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn of listening to this event
    socket.off("newConversation", payload);
  } else if (typeof payload == "function") {
    // payload as callback for this event
    socket.on("newConversation", payload);
  } else {
    socket.emit("newConversation", payload); // sending payload as data
  }
};

export const getConversations = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn of listening to this event
    socket.off("getConversations", payload);
  } else if (typeof payload == "function") {
    // payload as callback for this event
    socket.on("getConversations", payload);
  } else {
    socket.emit("getConversations", payload); // sending payload as data
  }
};

export const newMessage = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn of listening to this event
    socket.off("newMessage", payload);
  } else if (typeof payload == "function") {
    // payload as callback for this event
    socket.on("newMessage", payload);
  } else {
    socket.emit("newMessage", payload); // sending payload as data
  }
};

export const getMessages = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn of listening to this event
    socket.off("getMessages", payload);
  } else if (typeof payload == "function") {
    // payload as callback for this event
    socket.on("getMessages", payload);
  } else {
    socket.emit("getMessages", payload); // sending payload as data
  }
};
