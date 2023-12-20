export default function Spinner({ customCss }: { customCss?: {} }) {
  return <div className="loading__spinner" style={customCss}></div>;
}
