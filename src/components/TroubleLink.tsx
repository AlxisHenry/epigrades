import {
  errors,
  type Credentials,
  clearCache,
  validateCredentials,
  type Alert,
  AlertType,
} from "@/services/online";

/**
 * This component is used to display a link to the user to clear the cache linked to his account.
 */
export default function TroubleLink({
  credentials,
  setAlert,
  setIsSubmitting,
}: {
  credentials: Credentials;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <span
      onClick={async () => {
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
      className="trouble"
    >
      I&apos;m having trouble due to a cache issue...
    </span>
  );
}
