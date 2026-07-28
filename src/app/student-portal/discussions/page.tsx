import { getDiscussions } from "@/lib/actions/discussions";
import { DiscussionsClient } from "./DiscussionsClient";

export default async function DiscussionsPage() {
  let discussionsData: any[] = [];

  try {
    discussionsData = await getDiscussions();
  } catch (error) {
    console.error("Failed to load discussions:", error);
  }

  return <DiscussionsClient discussions={discussionsData} />;
}
