import React, { ReactNode } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type CardWrapperProps = {
  cardTitle: string;
  cardDescription?: string;
  cardFooterDescription?: ReactNode;
  cardFooterLink?: string;
  cardFooterLinkTitle?: string;
  children: ReactNode;
};

const CardWrapper: React.FC<CardWrapperProps> = ({
  cardTitle,
  cardDescription,
  cardFooterDescription,
  cardFooterLink,
  cardFooterLinkTitle,
  children,
}) => {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader className="my-2 text-center text-xl">
        <CardTitle>{cardTitle}</CardTitle>
        {cardDescription && (
          <CardDescription>{cardDescription}</CardDescription>
        )}
      </CardHeader>

      <CardContent>{children}</CardContent>

      {(cardFooterDescription || (cardFooterLink && cardFooterLinkTitle)) && (
        <CardFooter className="flex flex-col items-center text-center text-sm text-gray-500">
          <span>{cardFooterDescription}</span>
          {cardFooterLink && cardFooterLinkTitle && (
            <a
              href={cardFooterLink}
              className="pt-2 text-blue-500 hover:underline"
            >
              {cardFooterLinkTitle}
            </a>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default CardWrapper;
