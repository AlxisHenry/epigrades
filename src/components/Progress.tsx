"use client";

type Props = {
  currentStep: string;
  progress: number;
};

export default function Progress({ currentStep, progress }: Props) {
  return (
    <div className="progress-container">
      <span>{currentStep}</span>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          <div className="state">{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  );
}
