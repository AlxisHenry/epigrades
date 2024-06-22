import { Spinner } from "./Spinner";

interface IconProps {
  size?: number;
  icon: any;
  onClick?: () => void;
  loading?: boolean;
}

export function Icon(props: IconProps): JSX.Element {
  const { size, icon: Icon, onClick = () => {}, loading = false } = props;

  return (
    <div className="icon-container" onClick={onClick}>
      {loading && (
        <Spinner
          customCss={{
            width: size,
            height: size,
          }}
        />
      )}
      {!loading && <Icon size={size} />}
    </div>
  );
}
