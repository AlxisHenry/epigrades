import {
	AUTH_API_ENDPOINT,
	type AuthenticateResponse,
	type CacheClearedResponse,
	type Credentials,
	type ScraperResponse,
	type uuidResponse,
	type Progress,
	errors,
	isEpitechEmail,
	type EncodedPDFResponse,
} from "../online";

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

export const getReportInBase64 = async (uuid: string): Promise<EncodedPDFResponse> => {
	const response = await fetch(`/api/online/${uuid}/pdf`, {
		method: "GET",
	});
	return await response.json();
};
