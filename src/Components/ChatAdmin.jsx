import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("ws://157.66.191.24:4446");

const ChatAdmin = () => {
  const senderId = "68c2a7e04443d252c064ff7b";
  const receiverId = "68ff1880defbcf959431a14c";
  const senderType = "admin";
  const receiverType = "user";

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit("join", { userId: senderId });

    axios
      .get(
        `http://157.66.191.24:4446/api/chat/messages?senderId=${senderId}&receiverId=${receiverId}`
      )
      .then((res) => setChat(res.data.messages));

    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === senderId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === senderId)
      ) {
        setChat((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [senderId, receiverId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      senderId,
      receiverId,
      senderType,
      receiverType,
      content: message,
    });
    setMessage("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, width: 400, marginTop: "7rem" }}>
      <h3>Chat ({senderType}{receiverType})</h3>
      <div style={{ height: 300, overflowY: "auto", marginBottom: 10 }}>
        {chat.map((m) => (
          <div key={m._id} style={{ marginBottom: 5 }}>
            <b>{m.senderId === senderId ? "You" : receiverType}:</b> {m.content}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "75%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatAdmin;
