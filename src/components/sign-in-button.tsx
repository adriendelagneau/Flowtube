"use client";

import React from "react";

import { useAuthModal } from "@/lib/store/useAuthStore";

import { Button } from "./ui/button";

const SgnInButton = () => {
      const { open } = useAuthModal();
  return (
     <Button onClick={open}>
      Se connecter
    </Button>
  );
};

export default SgnInButton;
