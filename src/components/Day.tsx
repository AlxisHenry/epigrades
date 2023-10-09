import { type Day } from "@/services/days";

export default function Day({
  name,
  topic,
  assignments,
  due_date,
  submission,
  grade,
}: Day) {
  return (
    <tr>
      <td>{name}</td>
      <td>{topic}</td>
      <td>{assignments}</td>
      <td>{due_date}</td>
      <td>{submission}</td>
      <td>{grade}</td>
    </tr>
  );
}
