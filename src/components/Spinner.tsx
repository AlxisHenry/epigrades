import "@/styles/components/Spinner.scss";

export default function Spinner({ customCss }: { customCss?: {} }) {
  return <div className="loading__spinner" style={customCss}></div>;
}
