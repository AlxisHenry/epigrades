import Link from "next/link";
import "@/styles/components/CourseLink.scss";
import { LinkArrow } from "./Icons/LinkArrow";

type Props = {
  courseName: string;
  semester: string | undefined;
  content: string;
  title: boolean;
};

export default function CourseLink({ courseName, semester, content, title }: Props) {
  if (!semester) return null;
  return (
    <Link
      className={`course__link ${title ? "course__link--title" : ""}`}
      href="/semesters/[semester]/[course]"
      as={`/semesters/${semester.toLowerCase()}/${courseName.toLowerCase()}`}
    >
      <div>
        {content} <LinkArrow />
      </div>
      <div className="underline"></div>
    </Link>
  );
}
