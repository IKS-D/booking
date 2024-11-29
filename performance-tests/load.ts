import { check } from "k6";
import { Options } from "k6/options";
import http from "k6/http";

const BASE_URL = "http://localhost:3000";

export const options: Options = {
  stages: [
    { duration: "5m", target: 50 }, // Simulate ramp-up of traffic from 1 to 50 users over 5 minutes.
    { duration: "10m", target: 50 }, // Stay at 100 users for 10 minutes.
    { duration: "5m", target: 0 }, // Ramp-down to 0 users.
  ],
};

export function setup() {
  const formData = {
    email: "test@iksd.vercel.app",
    password: "admin123",
  };
  const headers = { "Content-Type": "application/json" };
  const result = http.post(`${BASE_URL}/auth/login`, formData, { headers: headers });

  return { token: result.json("data.token") };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const res = http.get(`${BASE_URL}/listings`);

  check(res, {
    "status is 200": () => res.status === 200,
  });
}
