"use client";

import { useAuthModal } from "@/lib/store/useAuthStore";

import { SignInView } from "./sign-in-view"; 
import { AuthModal } from "../auth-modal";


export const SignInModal = () => {
  const { isOpen, close } = useAuthModal();

  return (
    <AuthModal
      open={isOpen}
      onOpenChange={(open) => (open ? null : close())}
      title="Connexion ou inscription"
      footer={
        <p className="text-xs text-muted-foreground">
          En continuant, vous acceptez notre{" "}
          <a href="/legal" className="underline">
            politique de confidentialité
          </a>.
        </p>
      }
    >
      <SignInView />
    </AuthModal>
  );
};

