import React, { useState, useEffect } from 'react';
import './Create.css'; // Import the CSS file

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !age) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          age: parseInt(age, 10),
        }),
      });

      if (response.ok) {
        setSuccess('User created successfully');
        fetchUsers();
        setName('');
        setEmail('');
        setAge('');
      } else {
        setError('Failed to create user');
      }
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !age) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          age: parseInt(age, 10),
        }),
      });

      if (response.ok) {
        setSuccess('User updated successfully');
        fetchUsers();
        setName('');
        setEmail('');
        setAge('');
        setIsEditing(false);
        setEditUserId(null);
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    }
  };

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

  const startEditing = (user) => {
    setIsEditing(true);
    setEditUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age.toString());
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>{isEditing ? 'Update User' : 'Create User'}</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update User' : 'Create User'}
          </button>
        </form>
      </div>
      <div className="users-container">
        <h1>All Users</h1>
        <ul>
          {users.map(user => (
            <li key={user._id} className="user-item">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
              <button onClick={() => deleteUser(user._id)} className="btn btn-danger">Delete</button>
              <button onClick={() => startEditing(user)} className="btn btn-secondary">Update</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateUser;
