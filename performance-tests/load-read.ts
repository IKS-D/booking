/* eslint-disable */
import { check, sleep } from "k6";
import { Options } from "k6/options";
import http from "k6/http";
import { BASE_URL, cookies, login } from "./helpers.ts";
import exec from "k6/execution";

export const options: Options = {
  stages: [{ duration: "5m", target: 1000 }],
  /*   thresholds: {
    http_req_failed: [{ threshold: "rate<0.1", abortOnFail: true }], // http errors should be less than 1%
    http_req_duration: [{ threshold: "p(95)<400", abortOnFail: true }], // 95% of requests should be below 200ms
  }, */
};

export function setup() {
  return login();
}

export default function (data: { session: any }) {
  if (!data?.session) {
    exec.test.abort("No session found");
  }

  const res = http.get(`${BASE_URL}/reservations`, {
    cookies: cookies(JSON.stringify(data.session)),
  });

  check(res, {
    "status is 200": () => res.status === 200,
  });

  sleep(1);
}
