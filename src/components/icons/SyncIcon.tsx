interface SyncIcon {
  size?: number;
  isSyncing?: boolean;
}

export function SyncIcon({
  size = 48,
  isSyncing = false,
}: SyncIcon): JSX.Element {
  return (
    <svg
      className={`sync ${isSyncing ? "active" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height={size}
      width={size}
      viewBox="0 0 512 512"
    >
      <path d="M440.7 12.6l4 82.8A247.2 247.2 0 0 0 255.8 8C134.7 8 33.9 94.9 12.3 209.8A12 12 0 0 0 24.1 224h49.1a12 12 0 0 0 11.7-9.3 175.9 175.9 0 0 1 317-56.9l-101.5-4.9a12 12 0 0 0 -12.6 12v47.4a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0 -12-12h-47.4a12 12 0 0 0 -12 12.6zM255.8 432a175.6 175.6 0 0 1 -146-77.8l101.8 4.9a12 12 0 0 0 12.6-12v-47.4a12 12 0 0 0 -12-12H12a12 12 0 0 0 -12 12V500a12 12 0 0 0 12 12h47.4a12 12 0 0 0 12-12.6l-4.2-82.6A247.2 247.2 0 0 0 255.8 504c121.1 0 221.9-86.9 243.6-201.8a12 12 0 0 0 -11.8-14.2h-49.1a12 12 0 0 0 -11.7 9.3A175.9 175.9 0 0 1 255.8 432z" />
    </svg>
  );
}
