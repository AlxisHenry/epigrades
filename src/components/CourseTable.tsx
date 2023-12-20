import { isValidDay, type Day as DayType } from "@/services/days";
import Day from "./Day";

type Props = {
  days: DayType[];
};

export default function CourseTable({ days }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Topic</th>
          <th>Assignments</th>
          <th>Due Date</th>
          <th>Submission</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {days.map(
          (day: DayType) => isValidDay(day) && <Day {...day} key={day.name} />
        )}
      </tbody>
    </table>
  );
}
