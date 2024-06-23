import { Spinner } from "@/components";

interface Props {
  phone: string;
  setCode: (code: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSavingCode: boolean;
};

export function OtpForm({
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
            autoComplete="one-time-code"
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
          {isSavingCode ? (
            <Spinner
              customCss={{
                marginTop: "20px",
              }}
            />
          ) : (
            <button type="submit">Submit</button>
          )}
        </form>
      </div>
    </div>
  );
}
