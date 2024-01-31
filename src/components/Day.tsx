import { type Day } from "@/services/days";
import moment from "moment";

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
      <td>{moment(due_date).format("DD/MM/YYYY")}</td>
      <td>{submission}</td>
      <td>{grade}</td>
    </tr>
  );
}
