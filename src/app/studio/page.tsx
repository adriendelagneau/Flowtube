import { redirect } from "next/navigation";

import { getOrCreateDefaultChannel } from "@/actions/channel-actions";

export default async function StudioEntryPage() {
  const channel = await getOrCreateDefaultChannel();

  // redirect to the channel-specific studio
  redirect(`/studio/${channel.slug}`);
}
