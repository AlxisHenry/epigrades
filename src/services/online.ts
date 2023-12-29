import { Progress } from "@/app/api/online/route";
import { uuidResponse } from "@/app/api/online/uuid/route";
import { Credentials } from "@/app/online/page";

const AUTH_API_URL: string = "https://nsa.epitest.eu/api/login";
const EMAIL_REGEX: RegExp = new RegExp("^[a-zA-Z0-9._-]+@epitech.eu$", "i");
const FAKE_SLUG: string = "fake-slug";
export const NODE_SCRIPT_PATH = "scraper/index.js";
export const UNREACHABLE_SERVER_ERROR = "The server is unreachable.";
export const INVALID_CREDENTIALS_ERROR = "Invalid login";
export const REPORTS_DIR = "scraper/reports";
export const PROGRESS_DIR = "scraper/progress";

export const isEpitechEmail = (email: string) => EMAIL_REGEX.test(email);

export type ScraperResponse = {
  uuid: string;
};

export type AuthenticateResponse = {
  success: boolean;
  error?: string;
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
    const response = await fetch(AUTH_API_URL, {
      method: "POST",
      body: JSON.stringify({
        slug: FAKE_SLUG,
      }),
      credentials: "include",
      mode: "cors",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization:
          "Basic " + btoa(Array.from(Object.values(credentials)).join(":")),
      }),
    });

    const { error } = await response.json();

    if (error === INVALID_CREDENTIALS_ERROR) {
      return {
        success: false,
        error: INVALID_CREDENTIALS_ERROR,
      };
    }

    return {
      success: true,
      error: "",
    };
  } catch (e) {
    return {
      success: false,
      error: UNREACHABLE_SERVER_ERROR,
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

export const getExecutionProgress = async (
  email: string
): Promise<Progress> => {
  const response = await fetch("/api/online?email=" + email, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const saveOTPCode = async (
  email: string,
  code: string
): Promise<void> => {
  await fetch("/api/online/otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const retrieveGradeWithUUID = async (
  uuid: string
): Promise<uuidResponse> => {
  const response = await fetch("/api/online/uuid?uuid=" + uuid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const generateUUID = (): string => {
  return crypto.randomUUID() + "-" + Date.now();
};

const formatTimeElapsed = (value: number, unit: string): string => {
  return `${value} ${unit}${value > 1 ? "s" : ""}`;
};

const getTimeElapsedBetween = (d1: number, d2: number): string => {
  const diff = d1 - d2;
  const seconds = Math.floor(diff / 1000),
    minutes = Math.floor(seconds / 60),
    hours = Math.floor(minutes / 60),
    days = Math.floor(hours / 24),
    weeks = Math.floor(days / 7),
    months = Math.floor(days / 30),
    years = Math.floor(days / 365);

  if (seconds < 60) {
    return formatTimeElapsed(seconds, "second");
  } else if (minutes < 60) {
    return formatTimeElapsed(minutes, "minute");
  } else if (hours < 24) {
    return formatTimeElapsed(hours, "hour");
  } else if (days < 7) {
    return formatTimeElapsed(days, "day");
  } else if (weeks < 4) {
    return formatTimeElapsed(weeks, "week");
  } else if (months < 12) {
    return formatTimeElapsed(months, "month");
  } else {
    return formatTimeElapsed(years, "year");
  }
};

export const getTimeElapsed = (date: Date | string): string => {
  return getTimeElapsedBetween(
    Date.now(),
    typeof date === "string" ? Date.parse(date) : date.getTime()
  );
};
