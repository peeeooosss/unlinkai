import { getResources } from "@/lib/actions/resources";
import { ResourcesClient } from "./ResourcesClient";

export default async function ResourcesPage() {
  let resourcesData: any[] = [];

  try {
    resourcesData = await getResources();
  } catch (error) {
    console.error("Failed to load resources:", error);
  }

  return <ResourcesClient resources={resourcesData} />;
}
