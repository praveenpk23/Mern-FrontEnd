import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !age) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('https://mern-pk.onrender.com/users', {
        name,
        email,
        age: parseInt(age, 10),
      });
      if (response.status === 200) {
        setSuccess('User created successfully');
      }
      setName('');
      setEmail('');
      setAge('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create user');
      }
    }
  };

  return (
    <div className="container">
      <h2>Create User</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
