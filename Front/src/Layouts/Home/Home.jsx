import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminCalendar from "../AdminPanel/AdminTaskCalendar";
import TaskCalendar from "../TaskCalendar/TaskCalendar";
import LoginForm from "../LoginForm";

function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      fetchUser(authToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch("https://localhost:7136/api/Users/get_by_token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/Login" />;
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            user.userType === 0 ? <TaskCalendar /> : user.userType === 1 ? <AdminCalendar /> : null
          }
        />
        <Route path="/Login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default Home;
