"use client";

import "@/styles/pages/online.scss";
import Layout from "@/components/Layout";
import PageTitle from "@/components/PageTitle";
import {
  UNREACHABLE_SERVER_ERROR,
  getExecutionProgress,
  runScraper,
  saveOTPCode,
  validateCredentials,
} from "@/services/online";
import { useState } from "react";
import Progress from "@/components/Progress";
import OtpForm from "@/components/OtpForm";
import Spinner from "@/components/Spinner";
import { ScraperFinished } from "@/components/ScraperFinished";
import { ScraperFailed } from "@/components/ScraperFailed";

export type Credentials = {
  email: string;
  password: string;
};

export default function Home() {
  const [phone, setPhone] = useState<string>("");
  const [isAskingForOTPCode, setIsAskingForOTPCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [isSavingOTPCode, setIsSavingOTPCode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRunning(false);
    setIsFinished(false);
    setIsLoading(true);
    const { success, error } = await validateCredentials(credentials);
    if (!success) {
      setHasError(true);
      setError(error || UNREACHABLE_SERVER_ERROR);
      setIsLoading(false);
      return;
    }

    const { error: scraperError } = await runScraper(credentials);

    if (!scraperError) {
      setIsRunning(true);

      setTimeout(() => {
        const steps: string[] = [];
        let checkExecutionProgress = setInterval(async () => {
          let state = await getExecutionProgress(credentials.email);
          if (!steps.includes(state.currentStep)) {
            setProgress(state.progress);
            setCurrentStep(state.currentStep);
            if (state.currentStep.includes("Waiting for 2FA")) {
              setIsAskingForOTPCode(true);
              let parts = state.currentStep.split(" ");
              setPhone(`+${parts[parts.length - 1]}`);
            }
            if (state.currentStep.includes("report")) {
              clearInterval(checkExecutionProgress);
              setTimeout(() => {
                setIsFinished(true);
                setIsLoading(false);
              }, 1000);
            }
            if (state.currentStep.includes("Authentication failed")) {
              clearInterval(checkExecutionProgress);
              setTimeout(() => {
                setHasFailed(true);
                setIsLoading(false);
              }, 1000);
            }
            steps.push(state.currentStep);
          }
        }, 800);
      }, 100);
    }
  };

  return (
    <Layout>
      <PageTitle parts={["Welcome ✋"]} />
      {isRunning ? (
        <>
          {currentStep && progress ? (
            <Progress currentStep={currentStep} progress={progress} />
          ) : (
            <>
              <span
                style={{
                  textAlign: "center",
                  display: "block",
                  marginTop: "20px",
                  marginBottom: "20px",
                  color: "#d9d9d9",
                }}
              >
                Please wait...
              </span>
              <Spinner />
            </>
          )}
          {isAskingForOTPCode && (
            <OtpForm
              isSavingCode={isSavingOTPCode}
              phone={phone}
              setCode={setCode}
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSavingOTPCode(true);
                await saveOTPCode(credentials.email, code);
                setIsSavingOTPCode(false);
                setIsAskingForOTPCode(false);
              }}
            />
          )}
          {isFinished && (
            <ScraperFinished url={credentials.email.split("@")[0]} />
          )}
          {hasFailed && <ScraperFailed />}
        </>
      ) : (
        <>
          <div className="description">
            To have the same experience as me, you only need to put your
            Microsoft Epitech credentials here. Note that your credentials are
            not stored anywhere, they are only used to scrap your grades.
          </div>
          <form
            className="container"
            onSubmit={(e) => handleSubmit(e)}
            style={{
              paddingTop: "2rem",
            }}
          >
            {hasError && <div className="error">{error}</div>}
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="test@epitech.eu"
              onChange={(e) => handleChanges(e)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              onChange={(e) => handleChanges(e)}
            />
            {isLoading ? (
              <Spinner
                customCss={{
                  marginTop: "20px",
                  marginLeft: "0",
                }}
              />
            ) : (
              <button
                style={{
                  maxWidth: "250px",
                  marginTop: "10px",
                }}
                type="submit"
              >
                Let&apos;s go
              </button>
            )}
          </form>
        </>
      )}
    </Layout>
  );
}
