import { clearCache } from "@/services/online";

export const ScraperFailed = ({ email }: { email: string }) => {
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
        <h2>Authentication failed</h2>
        <p>We were unable to authenticate you. Please try again later.</p>
        <button
          style={{
            marginTop: "20px",
            width: "100%",
          }}
          type="submit"
          onClick={async () => {
            await clearCache(email);
            location.href = "/online";
          }}
        >
          Let me out !
        </button>
      </div>
    </div>
  );
};
