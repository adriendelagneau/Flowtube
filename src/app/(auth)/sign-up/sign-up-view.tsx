"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { signUpSchema } from "@/lib/zod";

export const SignUpView = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetImageState = () => {
    setImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    if (!executeRecaptcha) {
      console.log("not available to execute recaptcha");
      return;
    }

    const gRecaptcha = await executeRecaptcha("sign_up");
    if (!gRecaptcha) {
      setBackendError(
        "Captcha verification failed. Please refresh and try again."
      );
      return;
    }

    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        image: image ? await convertImageToBase64(image) : "",
        fetchOptions: {
          headers: {
            "x-captcha-response": gRecaptcha,
          },
        },
      },
      {
        onSuccess: () => {
          toast(
            "Your account has been created. Check your email for a verification link."
          );
          form.reset();
          resetImageState();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (ctx: any) => {
          const errorMessage = ctx?.error?.message || "Something went wrong";

          if (
            errorMessage.includes("captcha") ||
            errorMessage.toLowerCase().includes("suspicious") ||
            ctx?.status === 403
          ) {
            setBackendError(
              "Suspicious activity detected. Please refresh the page or try again later."
            );
            return;
          }

          setBackendError(errorMessage);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      autoComplete="off"
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
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
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

            <FormItem>
              <FormLabel>Profile Image (optional)</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={500} // Define the width explicitly
                      height={300} // Define the height explicitly
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex w-full items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <XIcon
                      className="cursor-pointer"
                      onClick={resetImageState}
                    />
                  )}
                </div>
              </div>
            </FormItem>
            {backendError && (
              <div className="text-sm text-red-500">{backendError}</div>
            )}
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full cursor-pointer"
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <Loader2Icon className="h-6 w-6 animate-spin" />
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="mt-4 flex justify-center text-sm">
        <Link href="/sign-in" className="text-primary hover:underline">
          Already have an account? Sign in
        </Link>
      </CardFooter>
    </Card>
  );
};

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
