import React, { useEffect } from "react";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { useAuth, useAuthDispatch } from "../contexts/AuthContext";
import axios from "axios";

export async function action({ request }) {
  try {
    let formData = await request.formData();
    const type = formData.get("type");
    const url =
      type === "register"
        ? "http://localhost:5000/api/v1/auth/register"
        : "http://localhost:5000/api/v1/auth/login";
    const { data } = await axios.post(url, {
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const { accessToken, refreshToken } = data;
    return { tokens: {accessToken, refreshToken}, error: null };
  } catch (error) {
    return {
      error: error.response.data.message || error.message,
      tokens: null
    }
  }
}

export function LoginPage() {
  const actionData = useActionData();
  const navigate = useNavigate();
  const authState = useAuth();
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    if (authState.loggedIn) {
      navigate("/");
    }
  }, [authState]);

  useEffect(() => {
    if (actionData?.tokens) {
      authDispatch({ type: "login", tokens: actionData.tokens });
      navigate("/");
    }
  }, [actionData]);

  return (
    <div className="wrapper">
      <NavBar />

      <main className="container">
        <div>
          <Form method="post">
            <h1>Login</h1>
            {actionData?.error && <div className="alert">{actionData?.error}</div> }
            <fieldset>
              <label htmlFor="login">
                <input
                  type="radio"
                  id="login"
                  name="type"
                  value="login"
                  defaultChecked
                />
                Login
              </label>
              <label htmlFor="register">
                <input
                  type="radio"
                  id="register"
                  name="type"
                  value="register"
                />
                Register
              </label>
            </fieldset>
            <input
              type="text"
              name="email"
              placeholder="Email"
              aria-label="Email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              required
            />

            <button type="submit" className="contrast">
              Login
            </button>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
