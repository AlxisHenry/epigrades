interface Props {
  customCss?: {};
}

export function Spinner({ customCss }: Props) {
  return <div className="loading__spinner" style={customCss}></div>;
}
