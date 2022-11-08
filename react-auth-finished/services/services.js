import { client } from "./axiosClient";

export function register({ email, password }) {
  return client.post(
    "auth/register",
    { email, password },
    { authorization: false }
  );
}

export function login({ email, password }) {
    return client.post(
      "auth/login",
      { email, password },
      { authorization: false }
    );
  }

export function getProfile() {
  return client.get("/users/profile");
}
