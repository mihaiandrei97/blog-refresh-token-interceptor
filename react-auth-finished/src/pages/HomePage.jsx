import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { getProfile } from "../../services/services";

export function HomePage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      getProfile().then(({data}) => {
        setProfile(data);
      }).catch(error => {
        console.error(error);
      })
   }
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
