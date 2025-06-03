"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EmailVerifiedView = () => {
  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            Email Verified!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 flex justify-center gap-1.5">
            Your email has been successfully verified.
            <span>
              <CheckIcon color="#194f2e" />
            </span>
          </p>
          <Link href="/">
            <Button className="w-full cursor-pointer">Go to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
