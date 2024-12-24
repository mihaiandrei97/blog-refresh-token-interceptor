import { Form, redirect } from "react-router";

export async function clientLoader() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return redirect("/");
  }
  return null;
}

export async function clientAction({ request }) {
  try {
    const formData = await request.formData();
    const type = formData.get("type");
    const email = formData.get("email");
    const password = formData.get("password");

    console.log({
      type,
      email,
      password,
    });

    return redirect("/");
  } catch (error) {
    return {
      error: error?.response?.data?.message || error.message,
    };
  }
}

export default function Login({ actionData }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Form method="post" className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Login
          </h1>
          {actionData?.error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{actionData.error}</span>
            </div>
          )}
          <fieldset className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="type"
                value="login"
                defaultChecked
              />
              <span className="ml-2">Login</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="type"
                value="register"
              />
              <span className="ml-2">Register</span>
            </label>
          </fieldset>
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
