import React, { useState, useEffect } from 'react';
import fetch from '../../axiosInterceptor';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://localhost:7136/api/Home/allusers', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.userName}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
