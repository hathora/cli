import fetch, { Headers, Request, Response } from "node-fetch";

if (!globalThis.fetch) {
	globalThis.fetch = fetch as any;
	globalThis.Headers = Headers as any;
	globalThis.Request = Request as any;
	globalThis.Response = Response as any;
}

import * as ApiClient from "../../sdk-client";
import { API_BASE } from "../config/api";

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
