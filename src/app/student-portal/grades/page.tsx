import { getStudentGrades } from "@/lib/actions/grades";
import { GradesClient } from "./GradesClient";

export default async function GradesPage() {
  let gradesData;

  try {
    gradesData = await getStudentGrades();
  } catch (error) {
    console.error("Failed to load grades:", error);
    gradesData = {
      courseGrades: [],
      gpa: 0,
      totalCourses: 0,
      activeSemester: null,
      allGrades: [],
    };
  }

  return <GradesClient gradesData={gradesData} />;
}
