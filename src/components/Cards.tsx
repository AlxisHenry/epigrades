interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Cards({ className, children }: Props) {
  return <div className={`cards ${className}`}>{children}</div>;
}
