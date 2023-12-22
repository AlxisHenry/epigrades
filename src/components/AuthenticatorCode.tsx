"use client";

import Spinner from "./Spinner";

type Props = {
  uuid: string;
};

export default function AuthenticatorCode({ uuid }: Props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <span
            style={{
              textAlign: "center",
              display: "block",
              marginTop: "20px",
              marginBottom: "20px",
              color: "#d9d9d9",
            }}
          >
            Please validate the authentication request in your authenticator app
          </span>
          <img
            style={{
              marginTop: "20px",
              filter: "invert(0.9)",
            }}
            width={60}
            height={60}
            src={`./authenticator/${uuid}.png`}
            alt="authenticator"
          />
        </div>
      </div>
    </div>
  );
}
