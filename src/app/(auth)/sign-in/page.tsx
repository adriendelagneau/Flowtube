"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { signInSchema } from "@/lib/zod";

export default function SignIn() {
  const router = useRouter();
  const [backendError, setBackendError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [providerLoading, setProviderLoading] = useState<
    "google" | "github" | null
  >(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>
  ) => {
    if (!executeRecaptcha) {
      console.log("not available to execute recaptcha");
      return;
    }

    const gRecaptcha = await executeRecaptcha("sign_in");
    if (!gRecaptcha) {
      setBackendError(
        "Captcha verification failed. Please refresh and try again."
      );
      return;
    }

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        fetchOptions: {
          headers: {
            "x-captcha-response": gRecaptcha,
          },
        },
      },
      {
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (ctx: any) => {
          console.log("Error:", ctx);
          const errorMessage = ctx?.error?.message || "Something went wrong";
          setBackendError(errorMessage);
        },
      }
    );
  };

  const handleSignInWithProvider = async (provider: "google" | "github") => {
    setProviderLoading(provider);
    await authClient.signIn.social(
      {
        provider,
      },
      {
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          console.log("Error:", ctx);
          const errorMessage = ctx?.error?.message || "Something went wrong";
          setBackendError(errorMessage);
        },
      }
    );

    setProviderLoading(null);
  };

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold">Log in</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Welcom back
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCredentialsSignIn)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 z-50 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <EyeOffIcon strokeWidth={0.5} />
                          ) : (
                            <EyeIcon strokeWidth={0.5} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm hover:underline">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password ?
                </Link>
              </div>
              {backendError && (
                <div className="text-sm text-red-500">{backendError}</div>
              )}
              <Button
                disabled={form.formState.isSubmitting}
                className="w-full cursor-pointer"
              >
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-6 w-6 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 flex w-full items-center gap-x-2">
            <Button
              size="lg"
              className="flex-1 cursor-pointer"
              onClick={() => handleSignInWithProvider("google")}
              disabled={providerLoading === "google"}
            >
              {providerLoading === "google" ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                <Image src="/google.svg" alt="Google" width={28} height={28} />
              )}
            </Button>

            <Button
              size="lg"
              className="flex-1 cursor-pointer"
              onClick={() => handleSignInWithProvider("github")}
              disabled={providerLoading === "github"}
            >
              {providerLoading === "github" ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                <Image src="/github.svg" alt="GitHub" width={28} height={28} />
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex w-full justify-center text-sm">
          <Link href="/sign-up" className="text-primary hover:underline">
            Don&apos;t have an account yet ? Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
