import Link from "next/link";
import { LinkArrow } from "./Icons/LinkArrow";

type Props = {
  isOnline?: boolean;
  uuid?: string;
  id: string;
  semester: string | undefined;
  content: string;
  title: boolean;
};

export default function CourseLink({
  isOnline = false,
  uuid,
  id,
  semester,
  content,
  title,
}: Props) {
  if (!semester) return null;

  const t = (text: string): string => text.toLowerCase();

  const getAs = (): string => {
    return isOnline
      ? `/online/${uuid}/${t(semester)}/${id}`
      : `/semesters/${t(semester)}/${id}`;
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
