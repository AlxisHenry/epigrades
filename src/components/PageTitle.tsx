import "@/styles/components/PageTitle.scss";
import Link from "next/link";

type Props = {
  parts: string[];
  clickable?: number[];
};

export default function PageTitle({ parts, clickable }: Props) {
  const isLast = (part: string) => parts.length - 1 === parts.indexOf(part);

  return (
    <div className="page__title__container">
      <h1 className="page__title">
        {parts.map((part) => {
          return (
            <span key={part}>
              {clickable && clickable.includes(parts.indexOf(part)) ? (
                <Link
                  className="page__title__link"
                  href={`/${parts
                    .slice(0, parts.indexOf(part) + 1)
                    .join("/")
                    .toLowerCase()}`}
                >
                  {part}
                </Link>
              ) : (
                <span>{part}</span>
              )}
              {!isLast(part) && (
                <span className="page__title__separator"> / </span>
              )}
            </span>
          );
        })}
      </h1>
      <div className="page__title__decoration"></div>
    </div>
  );
}
