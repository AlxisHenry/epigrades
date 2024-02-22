import Link from "next/link";

interface Props {
  parts: string[];
  clickable?: number[];
  customLink?: string;
}

export function PageTitle({ parts, clickable, customLink }: Props) {
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
                  href={
                    customLink
                      ? `/${customLink}`
                      : `/${parts[0].toLowerCase()}/${part.toLowerCase()}`
                  }
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
