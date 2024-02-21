type Props = {
  title: string;
};

export function SemesterTitle({ title }: Props) {
  return (
    <div className="semester__title">
      <div className="semester__title__text">{title}</div>
    </div>
  );
}
