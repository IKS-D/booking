import { check } from "k6";
import http from "k6/http";
import { Options } from "k6/options";

const BASE_URL = "http://localhost:3000";

export const options: Options = {
  stages: [
    { duration: "30m", target: 100 }, // Ramp-up to 100 users over 30 minutes.
    { duration: "12h", target: 100 }, // Maintain 100 users for 12 hours.
    { duration: "30m", target: 0 }, // Ramp-down to 0 users.
  ],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const res = http.get(`${BASE_URL}/listings`);

  check(res, {
    "status is 200": () => res.status === 200,
  });
}
