"use client";

import { type Credentials } from "@/services/online";
import Spinner from "./Spinner";
import TroubleLink from "./TroubleLink";

type Props = {
  credentials: Credentials;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setCacheCleared: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string;
  hasError: boolean;
  cacheCleared: boolean;
  isSubmitting: boolean;
  handleChanges: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function OnlineForm({
  credentials,
  setHasError,
  setError,
  setCacheCleared,
  handleSubmit,
  error,
  hasError,
  cacheCleared,
  isSubmitting,
  setIsSubmitting,
  handleChanges,
}: Props) {
  return (
    <form className="container" onSubmit={(e) => handleSubmit(e)}>
      {hasError && <div className="error">{error}</div>}
      {cacheCleared && (
        <div className="success">Cache successfully cleared.</div>
      )}
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
            setHasError={setHasError}
            setError={setError}
            setIsLoading={setIsSubmitting}
            setCacheCleared={setCacheCleared}
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
