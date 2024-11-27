import { check } from "k6";
import http from "k6/http";
import { Options } from "k6/options";

const BASE_URL = "http://localhost:3000";

export const options: Options = {
  stages: [
    { duration: "5m", target: 10 }, // Ramp-up to 10 users over 5 minutes.
    { duration: "10s", target: 500 }, // Spike to 500 users over 10 seconds.
    { duration: "5m", target: 10 }, // Return to 10 users over 5 minutes.
    { duration: "10s", target: 0 }, // Ramp-down to 0 users.
  ],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const res = http.get(`${BASE_URL}/listings`);

  check(res, {
    "status is 200": () => res.status === 200,
  });
}
