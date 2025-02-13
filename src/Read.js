import React, { useEffect, useState } from 'react';

const Read = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('There was an error fetching the users!', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers(users.filter(user => user._id !== id));
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('There was an error deleting the user!', error);
      }
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setUsers(users.map(user => (user._id === id ? updatedUser : user)));
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('There was an error updating the user!', error);
    }
  };

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
            <p>Updated At: {new Date(user.updatedAt).toLocaleString()}</p>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
            <button onClick={() => updateUser(user._id, { ...user, name: 'Updated Name' })}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Read;
