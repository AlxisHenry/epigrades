import { type Alert, type Credentials } from "@/services/online";
import { Spinner } from "../Spinner";
import TroubleLink from "../TroubleLink";

type Props = {
  credentials: Credentials;
  alert: Alert;
  isSubmitting: boolean;
  handleSubmit: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
};

export function OnlineForm({
  credentials,
  alert,
  isSubmitting,
  handleSubmit,
  setIsSubmitting,
  setAlert,
  setCredentials,
}: Props) {
  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="container"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {alert && <Alert type={alert.type} message={alert.message} />}
      <label htmlFor="email">Email</label>
      <input
        type="text"
        name="email"
        defaultValue={credentials.email}
        placeholder="test@epitech.eu"
        onChange={(e) => handleChanges(e)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Your password"
        onChange={(e) => handleChanges(e)}
      />
      {isSubmitting ? (
        <Spinner
          customCss={{
            marginTop: "20px",
            margin: "auto",
          }}
        />
      ) : (
        <>
          <TroubleLink
            credentials={credentials}
            setAlert={setAlert}
            setIsSubmitting={setIsSubmitting}
          />
          <button
            style={{
              maxWidth: "250px",
              marginTop: "10px",
            }}
            type="submit"
          >
            Let&apos;s go
          </button>
        </>
      )}
    </form>
  );
}

interface AlertProps {
  type: string;
  message: string;
}

const Alert = ({ type, message }: AlertProps) => (
  <div className={type}>{message}</div>
);
