export const ScraperFinished = ({ uuid }: { uuid: string }) => {
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
        <h2>Report generated</h2>
        <p>
          Your report is ready ! You can now open it by clicking on the button.
        </p>
        <button
          style={{
            marginTop: "20px",
            width: "100%",
          }}
          type="submit"
          onClick={() => (location.href = `/online/${uuid}`)}
        >
          Open report
        </button>
      </div>
    </div>
  );
};
