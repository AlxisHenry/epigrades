import { useState } from "react";

import { getIntranetStatus } from "@/services/api";
import type { Alert as AlertType, Credentials } from "@/services/online";

import { Spinner, TroubleLink, Alert as Warn } from "@/components";

interface Props {
  credentials: Credentials;
  alert: AlertType;
  isSubmitting: boolean;
  handleSubmit: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<React.SetStateAction<AlertType>>;
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
}

export function OnlineForm({
  credentials,
  alert,
  isSubmitting,
  handleSubmit,
  setIsSubmitting,
  setAlert,
  setCredentials,
}: Props) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [intranetIsUp, setIntranetIsUp] = useState<boolean>(false);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  getIntranetStatus().then((status) => {
    setIntranetIsUp(status);
    setIsLoaded(true);
  });

  let disabled = isSubmitting || !intranetIsUp;

  return (
    <form
      className="container"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (intranetIsUp) handleSubmit();
      }}
    >
      {isLoaded ? (
        <>
          {!intranetIsUp && (
            <Warn type="danger" title={"Intranet unreachable"}>
              The intranet is currently down, Epitech is probably doing some
              shits 👍
            </Warn>
          )}
          {alert && <Alert type={alert.type} message={alert.message} />}
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            defaultValue={credentials.email}
            disabled={disabled}
            readOnly={disabled}
            placeholder="test@epitech.eu"
            onChange={(e) => handleChanges(e)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            disabled={disabled}
            readOnly={disabled}
            placeholder="********"
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
                disabled={disabled}
              />
              <button
                style={{
                  maxWidth: "250px",
                  marginTop: "10px",
                }}
                type="submit"
                disabled={disabled}
              >
                Let&apos;s go
              </button>
            </>
          )}
        </>
      ) : (
        <Spinner />
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
