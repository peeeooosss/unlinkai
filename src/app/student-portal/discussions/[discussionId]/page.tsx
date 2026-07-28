import { getDiscussionThread } from "@/lib/actions/discussions";
import { DiscussionThreadClient } from "./DiscussionThreadClient";

interface PageProps {
  params: Promise<{ discussionId: string }>;
}

export default async function DiscussionThreadPage({ params }: PageProps) {
  const { discussionId } = await params;
  let threadData;

  try {
    threadData = await getDiscussionThread(discussionId);
  } catch (error) {
    console.error("Failed to load discussion:", error);
    return <div className="text-center py-12 text-neutral-500">Discussion not found</div>;
  }

  return <DiscussionThreadClient data={threadData} />;
}
