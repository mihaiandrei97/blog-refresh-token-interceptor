import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { getProfile } from "../services/services";

export function HomePage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      getProfile()
        .then(({ data }) => {
          setProfile(data)
        })
        .catch((error) => {
          console.log("err",error);
        });
    }
    // axios
    //   .get("http://localhost:5000/api/v1/users/profile", {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   })
    //   .then(({ data }) => {
    //     setProfile(data);
    //   })
    //   .catch((error) => {
    //     // if (error.response.data.message === "TokenExpiredError") {
    //     //   logout();
    //     // }
    //   });
  }, [isLoggedIn]);
  return (
    <>
      <h1>Welcome to home page</h1>
      {isLoggedIn ? (
        <>
          Your user data:
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </>
      ) : (
        <>You are not logged in</>
      )}
    </>
  );
}
