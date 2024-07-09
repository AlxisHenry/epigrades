import { type Report } from "./online";

type ComputedTeam = {
  name: string;
  count: number;
};

export function countTeams(report: Report | null): ComputedTeam[] {
  if (report === null) return [];
  let teams: { [key: string]: number } = {};

  report.semesters.forEach((semester) => {
    semester.courses.forEach((course) => {
      course.team = course.team || "Unknown";

      if (teams[course.team]) {
        teams[course.team]++;
      } else {
        teams[course.team] = 1;
      }
    });
  });

  return Object.keys(teams).map((team) => {
    return { name: team, count: teams[team] };
  });
}