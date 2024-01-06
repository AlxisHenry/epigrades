"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { getAuthenticatorCodeImage } from "@/services/online";

type Props = {
  uuid: string;
};

export default function AuthenticatorCode({ uuid }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => {
        if (timer === 0) {
          clearInterval(interval);
          return 0;
        }
        return timer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setImage(await getAuthenticatorCodeImage(uuid));
      setIsLoading(false);
    };

    initialize();
  }, [uuid]);

  return (
    <div className="modal">
      <div className="modal-content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
            with the following code
          </span>
          {isLoading ? (
            <Spinner
              customCss={{
                marginTop: "20px",
                marginBottom: "20px",
              }}
            />
          ) : (
            <Image
              style={{
                marginTop: "20px",
                filter: "invert(0.9)",
              }}
              width={60}
              height={60}
              src={`data:image/png;base64,${image}`}
              alt="authenticator"
            />
          )}
          <span
            style={{
              marginTop: "25px",
              fontSize: "14px",
              color: "#d9d9d9",
              textAlign: "center",
            }}
          >
            You have {timer} second{timer > 1 ? "s" : ""} to validate the
            request !
          </span>
        </div>
      </div>
    </div>
  );
}
