import React, { useEffect, useState } from "react";
import "./App.css";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userImage?: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const URL = "/api/users";

  const fetchUsers = async () => {
    try {
      const response = await fetch(URL);
      const userData: User[] = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div>Hello testing</div>
      {error && <p>Error: {error}</p>}
      <div>
        {users.map((user) => (
          <div key={user._id}>
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            {user.userImage && (
              <img
                src={user.userImage}
                alt={`${user.firstName} ${user.lastName}`}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
