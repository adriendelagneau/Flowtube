"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { authClient } from "@/lib/auth/auth-client"; 

interface LogoutButtonProps {
  children: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();

  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
      },
    });
  };
  return (
    <span onClick={handleSignout} className="cursor-pointer">
      {children}
    </span>
  );
};
