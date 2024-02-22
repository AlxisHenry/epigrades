interface Props {
  currentStep: string;
  progress: number;
}

export function Progress({ currentStep, progress }: Props) {
  return (
    <div className="progress-container">
      <span
        style={{
          textAlign: "center",
        }}
      >
        {currentStep}
      </span>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          <div className="state">{progress}%</div>
        </div>
      </div>
    </div>
  );
}
