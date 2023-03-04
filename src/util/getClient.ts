import fetch, { Headers, Request, Response } from "node-fetch";
import FormData from "form-data";
// @ts-expect-error
globalThis.FormData = FormData;
globalThis.fetch = fetch as any;
globalThis.Headers = Headers as any;
globalThis.Request = Request as any;
globalThis.Response = Response as any;

// form-data works for our use case so we don't care about the warning for now.
SuppressWarnings([(warning) => warning.toString().includes("form-data")]);

import * as ApiClient from "../../sdk-client";
import { API_BASE } from "../config/api";
import SuppressWarnings from "suppress-warnings";

export function getApiClient(token: string) {
	let client = new ApiClient.DefaultApi(
		new ApiClient.Configuration({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			basePath: API_BASE,
		})
	);
	return client;
}
