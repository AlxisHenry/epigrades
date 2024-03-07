"use client";

import "@/styles/pages/online.scss";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  type Credentials,
  errors,
  isStep,
  steps,
  type Alert,
  AlertType,
} from "@/services/online";
import {
  getExecutionProgress,
  getIntranetStatus,
  hasReport,
  runScraper,
  saveOTPCode,
  validateCredentials,
} from "@/services/api";

import {
  HasReport,
  AuthenticatorCode,
  ScraperFailed,
  ScraperFinished,
} from "@/components/modal";
import { OnlineForm, OtpForm } from "@/components/form";
import {
  Layout,
  PageTitle,
  Spinner,
  Progress,
  Alert as Warn,
  Loading,
} from "@/components";

export default function Home() {
  const params = useSearchParams();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [intranetIsUp, setIntranetIsUp] = useState<boolean>(false);
  const [alreadyHasReport, setAlreadyHasReport] = useState<boolean>(false);
  const [alert, setAlert] = useState<Alert>(null);
  const [phone, setPhone] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAskingForOTPCode, setIsAskingForOTPCode] = useState<boolean>(false);
  const [
    isAskingForAuthenticatorValidation,
    setIsAskingForAuthenticatorValidation,
  ] = useState<boolean>(false);
  const [isSavingOTPCode, setIsSavingOTPCode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [uuid, setUuid] = useState<string>("");
  const [credentials, setCredentials] = useState<Credentials>({
    email: params.get("email") ?? "",
    password: "",
  });

  const hideModals = () => {
    setIsAskingForOTPCode(false);
    setIsAskingForAuthenticatorValidation(false);
    setIsSavingOTPCode(false);
  };

  const handleSubmit = async (fromModal: boolean = false) => {
    if (!fromModal) {
      setAlert(null);
      setIsSubmitting(true);

      const { success, error } = await validateCredentials(credentials);

      if (!success) {
        setAlert({
          type: AlertType.error,
          message: error || errors.unreachableServer,
        });
        setIsSubmitting(false);
        return;
      }

      const { state, uuid } = await hasReport(credentials);

      if (state) {
        if (uuid) {
          setUuid(uuid);
          setAlreadyHasReport(true);
          return;
        }
      }
    }

    const { uuid } = await runScraper(credentials);

    if (!uuid) {
      setAlert({
        type: AlertType.error,
        message: errors.unreachableServer,
      });
      setIsSubmitting(false);
      return;
    }

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
            !isStep(
              state.currentStep,
              steps.waitingForTwoFactorAuthentication
            ) &&
            !isStep(
              state.currentStep,
              steps.waitingForMicrosoftAuthenticatorValidation
            )
          ) {
            hideModals();
          }

          if (
            isStep(state.currentStep, steps.waitingForTwoFactorAuthentication)
          ) {
            setIsAskingForOTPCode(true);
            let parts = state.currentStep.split(" ");
            setPhone(`+${parts[parts.length - 1]}`);
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
  };

  getIntranetStatus().then((status) => {
    setIntranetIsUp(status);
    setIsLoaded(true);
  });

  return (
    <Layout>
      {isLoaded ? (
        <>
          <PageTitle parts={["Epigrades 🎓"]} />
          {!intranetIsUp && (
            <Warn
              type="danger"
              title={"Intranet unreachable"}
              customCss={{
                marginBottom: "2rem",
              }}
            >
              The intranet is currently down, Epitech is probably doing some
              shits 👍
            </Warn>
          )}
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
                alert={alert}
                isSubmitting={isSubmitting}
                intranetIsUp={intranetIsUp}
                handleSubmit={handleSubmit}
                setIsSubmitting={setIsSubmitting}
                setAlert={setAlert}
                setCredentials={setCredentials}
              />
              {alreadyHasReport && (
                <HasReport uuid={uuid} generateNewReport={handleSubmit} />
              )}
            </Suspense>
          )}
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  );
}
