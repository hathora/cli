/* Copyright 2023 Hathora, Inc. */
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

import { API_BASE } from "../config/api";

import SuppressWarnings from "suppress-warnings";

import {
	AppV1Api,
	BuildV1Api,
	Configuration,
	DeploymentV1Api,
	LogV1Api,
	ProcessesV1Api,
	RoomV1Api,
} from "../../sdk-client";

export function getBuildApiClient(token: string) {
	return new BuildV1Api(
		new Configuration({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			basePath: API_BASE,
		})
	);
}

export function getAppApiClient(token: string) {
	return new AppV1Api(
		new Configuration({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			basePath: API_BASE,
		})
	);
}

export function getDeploymentApiClient(token: string) {
	return new DeploymentV1Api(
		new Configuration({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			basePath: API_BASE,
		})
	);
}

export function getLogApiClient(token: string) {
	return new LogV1Api(
		new Configuration({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			basePath: API_BASE,
		})
	);
}

export function getProcessesApiClient(token: string) {
	return new ProcessesV1Api(
		new Configuration({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			basePath: API_BASE,
		})
	);
}

export function getRoomApiClient(token: string) {
	return new RoomV1Api(
		new Configuration({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			basePath: API_BASE,
		})
	);
}
