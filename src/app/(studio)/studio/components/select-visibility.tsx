"use client"; 
import { GlobeIcon, LockIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const VisibilitySelect = ({ visibility }: { visibility: string }) => {
  return (
    <Select defaultValue={visibility}>
      <SelectTrigger>
        <SelectValue placeholder="Select visibility" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">
          <div className="flex">
            <GlobeIcon className="mr-2 size-4" />
            Public
          </div>
        </SelectItem>
        <SelectItem value="private">
          <div className="flex">
            <LockIcon className="mr-2 size-4" />
            Private
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

