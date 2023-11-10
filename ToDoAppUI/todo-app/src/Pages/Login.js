// Login.js
import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { setMessage, removeMessage } from '../utils';
import MessageDisplay from './MessageDisplay';
import ErrorMessageDisplay from './ErrorMessageDisplay';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [response, setResponse] = useState('');

  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/Auth/login`, {
        username: formData.username,
        password: formData.password,
      });

      // Assuming the API returns a token
      const token = response.data;

      if (token) {

        // Store the token in sessionStorage
        sessionStorage.setItem('token', token);
        try {
          // Decode the token to get user information
          const decodedToken = jwtDecode(token);
          // Assuming 'sub' is the standard claim for user ID in a JWT
          sessionStorage.setItem('userId', decodedToken.nameid);

          setMessage(`Successfully logged in! Welcome ${decodedToken.unique_name}`);
          nav("/todoitems");
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        setResponse('Token not found.');
      }
    } catch (error) {
      removeMessage();
      setResponse(error.response.data);
      console.error('Login failed', error);
    }
  };

  return (
    <div className="container">
      <MessageDisplay hidden={!response} />
      <ErrorMessageDisplay message={response} />
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label className="ns-label" htmlFor="username">
          Username:
        </label>
        <div id="username-hint" className="ns-hint">
          Please enter your username.
        </div>
        <input className="ns-input fw-30" type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
        <br />
        <label className="ns-label" htmlFor="password">
          Password:
        </label>
        <div id="password-hint" className="ns-hint">
          Please enter your password.
        </div>
        <input className="ns-input fw-30" type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        <br />
        <button className="btn-lg btn-default" type="submit">Login</button> &nbsp;&nbsp;&nbsp;
        <button className="btn-lg btn-default" onClick={() => { nav("/registration") }}>Register</button>
      </form>
    </div>
  );
};

export default Login;