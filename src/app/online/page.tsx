"use client";

import "@/styles/pages/online.scss";
import Layout from "@/components/Layout";
import PageTitle from "@/components/PageTitle";
import {
  type Credentials,
  errors,
  getExecutionProgress,
  runScraper,
  saveOTPCode,
  validateCredentials,
  isStep,
  steps,
} from "@/services/online";
import { Suspense, useState } from "react";
import Progress from "@/components/Progress";
import OtpForm from "@/components/OtpForm";
import Spinner from "@/components/Spinner";
import { ScraperFinished } from "@/components/ScraperFinished";
import { ScraperFailed } from "@/components/ScraperFailed";
import AuthenticatorCode from "@/components/AuthenticatorCode";
import { useSearchParams } from "next/navigation";
import OnlineForm from "@/components/OnlineForm";

export default function Home() {
  const params = useSearchParams();
  const [phone, setPhone] = useState<string>("");
  const [isAskingForOTPCode, setIsAskingForOTPCode] = useState<boolean>(false);
  const [
    isAskingForAuthenticatorValidation,
    setIsAskingForAuthenticatorValidation,
  ] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [isSavingOTPCode, setIsSavingOTPCode] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cacheCleared, setCacheCleared] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credentials>({
    email: params.get("email") ?? "",
    password: "",
  });

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRunning(false);
    setIsFinished(false);
    setIsSubmitting(true);
    const { success, error } = await validateCredentials(credentials);
    if (!success) {
      setHasError(true);
      setError(error || errors.unreachableServer);
      setIsSubmitting(false);
      return;
    }

    const { uuid } = await runScraper(credentials);

    if (uuid) {
      setUuid(uuid);
      setIsRunning(true);
      setTimeout(() => {
        const stepsDone: string[] = [];
        let checkExecutionProgress = setInterval(async () => {
          let state = await getExecutionProgress(uuid);
          if (!stepsDone.includes(state.currentStep)) {
            setProgress(state.progress);
            setCurrentStep(state.currentStep);
            if (
              isStep(state.currentStep, steps.waitingForTwoFactorAuthentication)
            ) {
              setIsAskingForOTPCode(true);
              let parts = state.currentStep.split(" ");
              setPhone(`+${parts[parts.length - 1]}`);
            } else if (
              isStep(state.currentStep, steps.twoFactorAuthenticationCodeSent)
            ) {
              setIsAskingForOTPCode(false);
              setIsSavingOTPCode(false);
            } else if (isStep(state.currentStep, steps.reportGenerated)) {
              clearInterval(checkExecutionProgress);
              setTimeout(() => {
                setIsFinished(true);
                setIsSubmitting(false);
              }, 1000);
            } else if (isStep(state.currentStep, steps.authenticationFailed)) {
              clearInterval(checkExecutionProgress);
              setTimeout(() => {
                setHasFailed(true);
                setIsSubmitting(false);
              }, 1000);
            } else if (
              isStep(
                state.currentStep,
                steps.waitingForMicrosoftAuthenticatorValidation
              )
            ) {
              setIsAskingForAuthenticatorValidation(true);
            }
            stepsDone.push(state.currentStep);
          }
        }, 800);
      }, 100);
    }
  };

  return (
    <Layout>
      <PageTitle parts={["Epigrades 🎓"]} />
      {isRunning ? (
        <>
          {currentStep && progress ? (
            <>
              <Progress currentStep={currentStep} progress={progress} />
            </>
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
                await saveOTPCode(uuid, code);
              }}
            />
          )}
          {isAskingForAuthenticatorValidation && (
            <AuthenticatorCode uuid={uuid} />
          )}
          {isFinished && <ScraperFinished uuid={uuid} />}
          {hasFailed && <ScraperFailed email={credentials.email} />}
        </>
      ) : (
        <Suspense fallback={<Spinner />}>
          <OnlineForm
            credentials={credentials}
            setHasError={setHasError}
            setError={setError}
            setCacheCleared={setCacheCleared}
            handleSubmit={handleSubmit}
            error={error}
            hasError={hasError}
            cacheCleared={cacheCleared}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            handleChanges={handleChanges}
          />
        </Suspense>
      )}
    </Layout>
  );
}
