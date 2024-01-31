import { Progress } from "@/app/api/online/route";
import { uuidResponse } from "@/app/api/online/[uuid]/route";

const AUTH_API_ENDPOINT: string = "https://console.bocal.org/auth/login";
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
  reports: (uuid: string, pdf: boolean = false) =>
    `${paths.base}/reports/${uuid}.${pdf ? "pdf" : "json"}`,
  temp: {
    otp: (uuid: string) => `${paths.temp}/otp-${uuid}.json`,
    progress: (uuid: string) => `${paths.temp}/progress-${uuid}.json`,
    authenticator: (uuid: string) => `${paths.temp}/authenticator-${uuid}.png`,
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

export const authenticateUsingEpitechAPI = async (
  credentials: Credentials
): Promise<AuthenticateResponse> => {
  if (!isEpitechEmail(credentials.email)) {
    return {
      success: false,
      error: "You must use your Epitech email",
    };
  }

  try {
    const response = await fetch(AUTH_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        id: credentials.email || "-",
        password: credentials.password || "-",
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    const { message } = await response.json();

    if (response.status === 401 && message === errors.invalidCredentials) {
      return {
        success: false,
        error: errors.invalidCredentials,
      };
    }

    if (response.status !== 200) {
      return {
        success: false,
        error: errors.unreachableServer,
      };
    }

    return {
      success: true,
      error: "",
    };
  } catch (e) {
    return {
      success: false,
      error: errors.unreachableServer,
    };
  }
};

export const validateCredentials = async (
  credentials: Credentials
): Promise<AuthenticateResponse> => {
  const response = await fetch("/api/online/auth", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const runScraper = async (
  credentials: Credentials
): Promise<ScraperResponse> => {
  const response = await fetch("/api/online", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const getExecutionProgress = async (uuid: string): Promise<Progress> => {
  const response = await fetch("/api/online?uuid=" + uuid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const saveOTPCode = async (
  uuid: string,
  code: string
): Promise<void> => {
  await fetch("/api/online/otp", {
    method: "POST",
    body: JSON.stringify({ uuid, code }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const getReport = async (uuid: string = "me"): Promise<uuidResponse> => {
  const response = await fetch(`/api/online/${uuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const uuid = (): string => {
  return crypto.randomUUID() + "-" + Date.now();
};

export const clearCache = async (
  email: string
): Promise<CacheClearedResponse> => {
  const response = await fetch("/api/online/reset", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const getAuthenticatorCodeImage = async (
  uuid: string
): Promise<string> => {
  const response = await fetch(`/api/online/authenticator?uuid=${uuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const { image } = await response.json();
  return image;
};

export const getReportInBase64 = async (uuid: string): Promise<string> => {
  const response = await fetch(`/api/online/${uuid}/pdf`, {
    method: "GET",
  });
  const { base64 } = await response.json();
  return base64;
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
