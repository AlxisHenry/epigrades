import {
  errors,
  type Credentials,
  type Alert,
  AlertType,
} from "@/services/online";
import { clearCache, validateCredentials } from "@/services/api";

interface Props {
  credentials: Credentials;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}

export function TroubleLink({
  credentials,
  setAlert,
  setIsSubmitting,
  disabled = false,
}: Props) {
  return (
    <span
      onClick={async () => {
        if (disabled) return;

        setIsSubmitting(true);

        const { success, error } = await validateCredentials(credentials);

        if (!success) {
          setAlert({
            type: AlertType.error,
            message: error || errors.unreachableServer,
          });
          setIsSubmitting(false);
          return;
        }

        setAlert(null);

        const { success: cacheClearedStatus } = await clearCache(
          credentials.email
        );

        if (!cacheClearedStatus) {
          setAlert({
            type: AlertType.error,
            message: errors.cannotClearCache,
          });
          setIsSubmitting(false);
          return;
        }

        setAlert({
          type: AlertType.success,
          message: "Cache cleared successfully!",
        });
        setIsSubmitting(false);
      }}
      className={`trouble ${disabled ? "disabled" : ""}`}
    >
      I&apos;m having trouble due to a cache issue...
    </span>
  );
}
