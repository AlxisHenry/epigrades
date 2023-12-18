import Link from "next/link";
import "@/styles/components/CourseLink.scss";
import { LinkArrow } from "./Icons/LinkArrow";

type Props = {
  isOnline?: boolean;
  uuid?: string;
  courseName: string;
  semester: string | undefined;
  content: string;
  title: boolean;
};

export default function CourseLink({
  isOnline = false,
  uuid,
  courseName,
  semester,
  content,
  title,
}: Props) {
  if (!semester) return null;

  const t = (text: string): string => text.toLowerCase();

  const getAs = (): string => {
    return isOnline
      ? `/online/${uuid}/${t(semester)}/${t(courseName)}`
      : `/semesters/${t(semester)}/${courseName.toLowerCase()}`;
  };

  const getLink = (): string => {
    return isOnline
      ? "/online/[uuid]/[semester]/[course]"
      : "/semesters/[semester]/[course]";
  };

  return (
    <Link
      className={`course__link ${title ? "course__link--title" : ""}`}
      href={getLink()}
      as={getAs()}
    >
      <div>
        {content} <LinkArrow />
      </div>
      <div className="underline"></div>
    </Link>
  );
}
