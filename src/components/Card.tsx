interface Props {
  title: string;
  subtitle: string;
}

export function Card({ title, subtitle }: Props) {
  return (
    <div className="card">
      <div className="card__title">{title}</div>
      <div className="card__subtitle">{subtitle}</div>
    </div>
  );
}
