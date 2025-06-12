"use client";

import React from "react";

import { socket } from "@/socket";

import { Button } from "./ui/button";

const TestButton = () => {

  const handleEmmit = () => {
    socket.emit("hello", "world");
  };
  return (
    <div>
      <Button onClick={handleEmmit}>Click me</Button>
    </div>
  );
};

export default TestButton;
