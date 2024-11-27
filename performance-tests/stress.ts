import { check } from "k6";
import http from "k6/http";
import { Options } from "k6/options";

const BASE_URL = "http://localhost:3000";

export const options: Options = {
  stages: [
    { duration: "2m", target: 200 }, // Ramp-up to 200 users over 2 minutes.
    { duration: "3m", target: 200 }, // Stay at 200 users for 3 minutes.
    { duration: "2m", target: 300 }, // Ramp-up to 300 users over 2 minutes.
    { duration: "3m", target: 300 }, // Stay at 300 users for 3 minutes.
    { duration: "2m", target: 400 }, // Ramp-up to 400 users over 2 minutes.
    { duration: "3m", target: 400 }, // Stay at 400 users for 3 minutes.
    { duration: "2m", target: 0 }, // Ramp-down to 0 users.
  ],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const res = http.get(`${BASE_URL}/listings`);

  check(res, {
    "status is 200": () => res.status === 200,
  });
}
