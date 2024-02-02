import { type Semester } from "./semesters";

export const AUTH_API_ENDPOINT: string = "https://console.bocal.org/auth/login";
export const EMAIL_EXTENSION: string = "@epitech.eu";

export const errors: {
  unreachableServer: string;
  invalidCredentials: string;
  cannotClearCache: string;
} = {
  unreachableServer: "The server is unreachable.",
  invalidCredentials: "Wrong Email or Password",
  cannotClearCache: "Something went wrong while clearing the cache.",
};

export const paths: {
  base: string;
  reports: string;
  temp: string;
} = {
  base: "scraper",
  reports: "scraper/reports",
  temp: "scraper/temp",
};

export const files = {
  script: `${paths.base}/index.js`,
  reports: (uuid: string) => `${paths.base}/reports/${uuid}.json`,
  temp: {
    otp: (uuid: string) => `${paths.temp}/otp-${uuid}.json`,
    progress: (uuid: string) => `${paths.temp}/progress-${uuid}.json`,
    authenticator: (uuid: string) => `${paths.temp}/authenticator-${uuid}.png`,
    report: (uuid: string) => `${paths.temp}/report-${uuid}.pdf`,
    all: (uuid: string) => [
      files.temp.otp(uuid),
      files.temp.progress(uuid),
      files.temp.authenticator(uuid),
    ],
  },
};

export const steps = {
  waitingForTwoFactorAuthentication: "Waiting for 2FA",
  twoFactorAuthenticationCodeSent: "The code has been sent",
  waitingForMicrosoftAuthenticatorValidation:
    "Waiting for Microsoft Authenticator validation",
  authenticationFailed: "Authentication failed",
  reportGenerated: "All tasks done",
};

export const isStep = (currentStep: string, step: string): boolean =>
  currentStep === step || currentStep.includes(step);

export const isEpitechEmail = (email: string) =>
  new RegExp(`^[a-zA-Z0-9._-]+${EMAIL_EXTENSION}$`, "i").test(email);

export type Progress = {
  currentStep: string;
  progress: number;
  status: number;
};

export type Alert = {
  type: AlertType;
  message: string;
} | null;

export enum AlertType {
  success = "success",
  error = "error",
}

export type Credentials = {
  email: string;
  password: string;
};

export type ScraperResponse = {
  uuid: string;
};

export type AuthenticateResponse = {
  success: boolean;
  error?: string;
};

export type CacheClearedResponse = {
  success: boolean;
};

export type uuidResponse = {
  success: boolean;
  report?: Report;
};

export type EncodedPDFResponse = {
  base64: string | null;
};

export type Report = {
  student: Student,
  semesters: Semester[];
  created_at: string;
}

export type Student = {
  email: string;
  name: string;
}

export const uuid = (): string => {
  return crypto.randomUUID() + "-" + Date.now();
};

export function base64ToBlob(base64: string) {
  const bytes = window.atob(base64);
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: "application/pdf" });
}
