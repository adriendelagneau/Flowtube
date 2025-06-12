"use client";

import React, { useState } from "react";

import { socket } from "@/socket";

const TestReceiver = () => {
  const [message, setMessage] = useState("");

  socket.on("reply", (message) => setMessage(message));

  return (
    <div>
      <p>Receive message: {message}</p>
    </div>
  );
};

export default TestReceiver;
