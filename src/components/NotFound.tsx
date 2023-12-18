export const NotFound = () => {
  return (
    <div className="error_section">
      <h1>404</h1>
      <p>Page not found</p>
      <button
        onClick={() => {
          location.href = "/";
        }}
      >
        Let me out !
      </button>
    </div>
  );
};
