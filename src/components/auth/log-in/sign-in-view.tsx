"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useAuthState } from "@/hooks/useAuthState";
import { useAuthState } from "@/hooks/useAuthState"; 
import { authClient } from "@/lib/auth/auth-client";


import FormError from "../form-error";
import SocialButton from "./social-button";

// Zod schema for magic link sign-in
const MagicLinkSignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Must be a valid email"),
});

type MagicLinkSignInSchemaType = z.infer<typeof MagicLinkSignInSchema>;

export const SignInView = () => {
  const router = useRouter();
  const { error, loading, setError, setLoading, resetState } = useAuthState();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<MagicLinkSignInSchemaType>({
    resolver: zodResolver(MagicLinkSignInSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: MagicLinkSignInSchemaType) => {
    resetState();
    setLoading(true);

    if (!executeRecaptcha) {
      setError("reCAPTCHA not yet available. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      // Run reCAPTCHA check
      await executeRecaptcha("magic_link_sign_in");

      // Proceed with magic link sign-in
      await authClient.signIn.magicLink(
        { email: values.email },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
          onSuccess: () => {
            toast("A magic link has been sent to your email.");
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Failed to send magic link.");
          },
        }
      );
    } catch (err) {
      console.error(err);
      setError("reCAPTCHA verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithProvider = async (provider: "google" | "github") => {
    resetState();
    setLoading(true);
    try {
      await authClient.signIn.social(
        { provider },
        {
          onSuccess: async () => {
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            console.log("Error:", ctx);
            setError(ctx?.error?.message || "Something went wrong");
          },
        }
      );
    } catch (err) {
      console.error(err);
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

      <Card className="mx-auto w-full max-w-md p-6">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                      <Input
                        type="email"
                        disabled={loading}
                        placeholder="Adresse email"
                        className="pl-12"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />

            <Button disabled={loading} type="submit" className="w-full">
              Envoyez un mail
            </Button>

            <div className="text-muted-foreground flex w-full items-center py-5 text-sm">
              <div className="border-secondary-foreground flex-grow border-t" />
              <span className="mx-2 text-lg">ou</span>
              <div className="border-secondary-foreground flex-grow border-t" />
            </div>

            <div className="mt-4">
              <SocialButton
                provider="google"
                icon={<FcGoogle size={"22"} />}
                label="continuer avec Google"
                onClick={() => handleSignInWithProvider("google")}
                disabled={loading}
              />
              <SocialButton
                provider="github"
                icon={<FaGithub size={"22"} />}
                label="continuer avec GitHub"
                onClick={() => handleSignInWithProvider("github")}
                disabled={loading}
              />
            </div>
          </form>
        </Form>
      </Card>
  );
};
