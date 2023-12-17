"use client";

import { Console } from "console";
import Spinner from "./Spinner";

type Props = {
  phone: string;
  setCode: (code: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSavingCode: boolean;
};

export default function OtpForm({
  phone,
  setCode,
  onSubmit,
  isSavingCode,
}: Props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={onSubmit}>
          <label htmlFor="otpCode">2FA Code</label>
          <p>The code has been sent to {phone}</p>
          <input
            maxLength={6}
            placeholder="Enter the code"
            type="text"
            name="otpCode"
            onKeyDown={(e) => {
              if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              if (e.target.value.length <= 6) {
                setCode(e.target.value);
              } else {
                e.target.value = e.target.value.slice(0, 6);
              }
            }}
          />
          {isSavingCode ? <Spinner /> : <button type="submit">Submit</button>}
        </form>
      </div>
    </div>
  );
}
