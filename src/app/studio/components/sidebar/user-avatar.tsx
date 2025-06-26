import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  imageUrl: string;
name?: string;
  className?: string;
  onClick?: () => void;
}

export const UserAvatar = ({
  imageUrl,

  className,
  onClick,
}: UserAvatarProps) => {
  return (
    <Avatar className={className} onClick={onClick}>
      <AvatarImage src={imageUrl} alt={"toto"} />
    </Avatar>
  );
};
