import {
  errors,
  type Credentials,
  clearCache,
  validateCredentials,
} from "@/services/online";

/**
 * This component is used to display a link to the user to clear the cache linked to his account.
 */
export default function TroubleLink({
  credentials,
  setHasError,
  setError,
  setIsLoading,
  setCacheCleared,
  style = {},
}: {
  credentials: Credentials;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCacheCleared: React.Dispatch<React.SetStateAction<boolean>>;
  style?: object;
}) {
  return (
    <span
      onClick={async () => {
        setIsLoading(true);

        const { success, error } = await validateCredentials(credentials);

        if (!success) {
          setHasError(true);
          setError(error || errors.unreachableServer);
          setIsLoading(false);
          return;
        }

        setHasError(false);

        await clearCache(credentials.email);

        setIsLoading(false);
        setCacheCleared(true);
      }}
      className="trouble"
      style={style}
    >
      I&apos;m having trouble due to a cache issue...
    </span>
  );
}
