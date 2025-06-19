// app/studio/[channelId]/page.tsx

import { redirect } from "next/navigation";

import { getUserChannels } from "@/actions/channel-actions";

import ChannelSelector from "../channel-selector";

interface PageProps {
  params: Promise<{ channelId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const channels = await getUserChannels();
  const { channelId } = await params;

  const current = channels.find((c) => c.id === channelId);

  if (!current) redirect("/studio"); // or show 404

  return (
    <div>
      <ChannelSelector channels={channels} currentChannelId={channelId} />
      <h1 className="text-xl font-bold">Studio - Channel ID: {channelId}</h1>
      {/* Channel content goes here */}
    </div>
  );
};

export default Page;
