export const AUTH_API_ENDPOINT: string = "https://console.bocal.org/auth/login";
export const INTRANET_HOSTNAME: string = "https://gandalf.epitech.eu";
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
  semesters: `${paths.base}/semesters.json`,
  reports: (uuid: string) => `${paths.base}/reports/${uuid}.json`,
  temp: {
    otp: (uuid: string) => `${paths.temp}/otp-${uuid}.json`,
    progress: (uuid: string) => `${paths.temp}/progress-${uuid}.json`,
    authenticator: (uuid: string) => `${paths.temp}/authenticator-${uuid}.png`,
    report: (uuid: string, semester: string) =>
      `${paths.temp}/report-${uuid}-${semester}.pdf`,
    zip: (uuid: string) => `${paths.temp}/report-${uuid}.zip`,
    all: (uuid: string) => [
      files.temp.otp(uuid),
      files.temp.progress(uuid),
      files.temp.authenticator(uuid),
    ],
  },
};

export const steps = {
  waitingForTwoFactorAuthentication: "Waiting for 2FA",
  waitingForMicrosoftAuthenticatorValidation:
    "Waiting for Microsoft Authenticator validation",
  logged: "Logged successfully to the intranet",
  starting: "Starting to retrieve your graded courses",
  authenticationFailed: "Authentication failed",
  reportGenerated: "All tasks done",
};

export const isStep = (currentStep: string, step: string): boolean =>
  currentStep === step || currentStep.includes(step);

export const isEpitechEmail = (email: string) =>
  new RegExp(`^[a-zA-Z0-9._-]+${EMAIL_EXTENSION}$`, "i").test(email);

export interface ScraperResponse {
  state: boolean;
  uuid: string | null;
}

export interface AuthenticateResponse {
  success: boolean;
  error?: string;
}

export interface CacheClearedResponse {
  success: boolean;
}

export interface uuidResponse {
  success: boolean;
  report?: Report;
}

export interface EncodedPDFResponse {
  filename: string | null;
  base64: string | null;
}

export interface IntranetStatusResponse {
  status: boolean;
}

export type Report = {
  student: Student;
  semesters: Semester[];
  future_courses: FutureCourse[];
  upcoming_events: Event[];
  created_at: string;
};

export type Event = {
  id: string;
  course: {
    id: string;
    name: string;
  };
  title: string;
  date: string;
  time: string;
  component: string;
  is_review: false;
};

export type Student = {
  email: string;
  name: string;
};

export type SemesterDate = {
  name: string;
  start: string;
  end: string;
};

export type Semester = {
  name: string;
  courses: Course[];
  created_at: string | null;
};

export type Course = {
  id: string;
  name: string;
  title: string;
  days: Day[];
  created_at: string;
};

export type FutureCourse = {
  id: string;
  name: string;
  title: string;
  start_date: string;
};

export type Day = {
  name: string;
  topic: string;
  assignments: string;
  due_date: string;
  submission: string;
  grade: string;
};

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
