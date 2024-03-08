import Image from "next/legacy/image";

interface AlertProps {
  children: React.ReactNode;
  title?: string | null;
  type?: "tips" | "warning" | "danger" | "info";
  customCss?: { [key: string]: string };
}

export function Alert({
  children,
  title = null,
  type = "info",
  customCss = {},
}: AlertProps) {
  return (
    <div className={`alert ${type}`} style={customCss}>
      <h3>{title ?? type}</h3>
      <Paragraph>{children}</Paragraph>
    </div>
  );
}

interface LinkProps {
  href: string;
  title: string;
  blank?: boolean;
}

export function Link({ href, title, blank = false }: LinkProps) {
  return (
    <a href={href} className="link" target={blank ? "_blank" : "_self"}>
      {title}
    </a>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title?: string | null;
}

export function Section({ children, title = null }: SectionProps) {
  return (
    <div className="section">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  return <p className="paragraph">{children}</p>;
}

interface HighlightProps {
  children: React.ReactNode;
}

export function Highlight({ children }: HighlightProps) {
  return (
    <span className="highlight-container">
      <span className="highlight">{children}</span>
    </span>
  );
}

interface GridProps {
  title: string;
  image: string;
  reverse?: boolean;
}

export function Grid({ title, image, reverse = false }: GridProps) {
  return (
    <div className={`grid ${reverse ? "reverse" : ""}`}>
      {reverse && <Screen src={image} />}
      <h3>{title}</h3>
      {!reverse && <Screen src={image} />}
    </div>
  );
}

interface ScreenProps {
  src: string;
  alt?: string;
}

export function Screen({ src, alt }: ScreenProps) {
  return (
    <div className="screen">
      <Image
        width={200}
        height={200 / (16 / 9)}
        layout="responsive"
        src={src}
        alt={alt ?? "Screen"}
      />
    </div>
  );
}
