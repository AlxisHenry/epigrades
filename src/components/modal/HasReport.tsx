import { useState } from "react";

import { Spinner } from "@/components";

interface Props {
  uuid: string;
  generateNewReport: (fromModal: boolean) => void;
}

export function HasReport({ uuid, generateNewReport }: Props) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="modal">
      <div
        className="modal-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <h2>Hey, we found a report for you!</h2>
        <p>
          Do you want to continue with the previous report? Or make a new one?
        </p>
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "1rem",
            marginTop: "20px",
          }}
        >
          {isLoading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <Spinner />
            </div>
          ) : (
            <>
              <button
                style={{
                  flex: 1,
                }}
                onClick={() => {
                  if (!disabled) {
                    setIsLoading(true);
                    setDisabled(true);
                    location.href = `/online/${uuid}`;
                  }
                }}
                type="submit"
              >
                Continue
              </button>
              <button
                style={{
                  flex: 1,
                }}
                type="submit"
                onClick={() => {
                  if (!disabled) {
                    setIsLoading(true);
                    setDisabled(true);
                    generateNewReport(true);
                  }
                }}
              >
                Make a new one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
