import { Spinner } from "./Spinner";

interface IconProps {
  size?: number;
  icon: any;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
}

export function Icon(props: IconProps): JSX.Element {
  const { size, icon: Icon, className = "", onClick = () => { }, loading = false } = props;

  return (
    <div className={`icon-container icon-container__${className}`} onClick={onClick}>
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
