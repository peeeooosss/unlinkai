import { getStudentSchedule } from "@/lib/actions/schedule";
import { ScheduleClient } from "./ScheduleClient";

export default async function SchedulePage() {
  let scheduleData: any[] = [];

  try {
    scheduleData = await getStudentSchedule();
  } catch (error) {
    console.error("Failed to load schedule:", error);
  }

  return <ScheduleClient schedule={scheduleData} />;
}
