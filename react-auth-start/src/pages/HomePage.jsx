import React, { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { useAuth, useAuthDispatch } from "../contexts/AuthContext";
import axios from "axios";

export function HomePage() {
  const authState = useAuth();
  const authDispatch = useAuthDispatch();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if(authState.loggedIn)
      axios
        .get("http://localhost:5000/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        })
        .then(({ data }) => {
          setProfile(data);
        }).catch(error => {
          if(error.response.data.message === 'TokenExpiredError'){
            authDispatch({type:'logout'})
          }
        });
    
  }, [authState]);
  return (
    <div className="wrapper">
      <NavBar />
      <main className="container">
        <h1>Welcome to home page</h1>
        {authState.loggedIn ? (
          <>
            Your user data:
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </>
        ) : (
          <>You are not logged in</>
        )}
      </main>
      <Footer />
    </div>
  );
}
