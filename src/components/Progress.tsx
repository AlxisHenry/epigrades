"use client";
import "@/styles/components/Progess.scss";

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
          <div className="state">{progress}%</div>
        </div>
      </div>
    </div>
  );
}