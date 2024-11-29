/* eslint-disable */
import encoding from "k6/encoding";
import http from "k6/http";

export const BASE_URL = "http://localhost:3000";

export function login() {
  const data = {
    email: "test@iksd.vercel.app",
    password: "admin123",
  };
  const headers = { "Content-Type": "application/json" };
  const result = http.post(`${BASE_URL}/auth/login`, JSON.stringify(data), {
    headers: headers,
  });

  // possible there is better way to do this but you now it works
  return { session: JSON.parse(JSON.stringify(result.json("data.session"))) };
}

export function cookies(session: string) {
  const authToken = "base64-" + encoding.b64encode(session);
  const cookies = {
    "sb-192-auth-token": {
      value: authToken,
      replace: true,
      expires: new Date(Date.now() + 86400 * 1000 * 365),
      samesite: "Lax",
      path: "/",
    },
  };

  return cookies;
}

export function createSampleListingData(user_id: string) {
  return {
    user_id: user_id,
    listing: {
      suspension_status: false,
      title: "load-test-listing",
      description: "No description",
      city: "Kaunastic city",
      address: "Kaunastic address",
      country: "Lithuania",
      creation_date: new Date().toISOString(),
      number_of_places: 1,
      day_price: 45450,
      category_id: 3,
      host_id: user_id,
    },
  };
}
