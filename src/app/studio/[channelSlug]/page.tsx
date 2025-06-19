// app/studio/[channelSlug]/page.tsx

import { redirect } from "next/navigation";

import { getUserChannels } from "@/actions/channel-actions";

import ChannelSelector from "../channel-selector";

interface PageProps {
  params: Promise<{ channelSlug: string }>;
}

const Page = async ({ params }: PageProps) => {
  const channels = await getUserChannels();
  const { channelSlug } = await params;

  const current = channels.find((c) => c.slug === channelSlug);

  if (!current) redirect("/studio"); // ou 404

  return (
    <div>
      <ChannelSelector channels={channels} currentChannelSlug={channelSlug} />
      <h1 className="text-xl font-bold">Studio - Channel: {channelSlug}</h1>
      {/* Contenu du channel */}
    </div>
  );
};

export default Page;
