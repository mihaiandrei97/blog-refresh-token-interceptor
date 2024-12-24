import { Form, redirect } from "react-router";

export function meta() {
  return [
    { title: "Welcome to React Auth with Axios Interceptor!" },
    {
      name: "description",
      content: "Welcome to React Auth with Axios Interceptor!",
    },
  ];
}

export function clientAction() {
  return redirect("/login");
}

export default function Home() {
  const loaderData = null;
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Welcome to React Auth with Axios Interceptor!
          </h1>

          <div className="bg-gray-50 rounded-lg p-4 mb-8 overflow-auto">
            <pre className="text-sm text-gray-700">
              <code>{JSON.stringify(loaderData, null, 2)}</code>
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Form method="post">
              <button
                type="submit"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
