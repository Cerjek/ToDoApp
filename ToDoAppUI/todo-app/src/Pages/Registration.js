// Registration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { setMessage, removeMessage } from '../utils';
import ErrorMessageDisplay from './ErrorMessageDisplay';

const Registration = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [formValid, setFormValid] = useState({
        email: true,
        username: true,
        password: true,
        firstName: true,
        lastName: true,
    });
    const [response, setResponse] = useState('');

    const nav = useNavigate();

    const goToLogin = () => { 
        const success = sessionStorage.getItem("success");
        if(success === 'false') {
            removeMessage();
        }
        nav("/");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        const validEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i.test(formData.email);
        const userValid = /^[A-Za-z0-9]{5,30}$/i.test(formData.username);
        const passwordValid = /^(?=.*[!@#$])(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$]{8,30}$/i.test(formData.password);
        const firstValid = /^[a-zA-Z]{1,35}(?:[- ]?[a-zA-Z]+)?$/i.test(formData.firstName) && formData.firstName.length <= 35;
        const lastValid = /^[a-zA-Z]{1,60}(?:[- ]?[a-zA-Z]+)?$/i.test(formData.lastName) && formData.lastName.length <= 60;

        setFormValid({
            email: validEmail,
            username: userValid,
            password: passwordValid,
            firstName: firstValid,
            lastName: lastValid,
        });
        
        if (validEmail && userValid && passwordValid && firstValid && lastValid) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/Auth/register`, {
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                });
                
                setMessage(response.data);
                goToLogin();

            } catch (error) {
                setResponse(error.response.data);
            }
            forceUpdate();
        }
    };

    const forceUpdate = () => {

    };

    return (
        <div className="container">
            <ErrorMessageDisplay message={response} />
            <h2>Registration</h2>
            <form onSubmit={handleRegistration}>
                <div className="ns-form-group">
                    <label className="ns-label" htmlFor="username">
                        Username:
                    </label>
                    <div id="username-hint" className="ns-hint">
                        Please enter a unique username.
                    </div>
                    <div className="ns-form-group-message-error">
                        <span id="username-error" className="ns-error-message" hidden={formValid.username}>
                            <i className="fa fa-exclamation-circle error-indicator errorAlert" aria-hidden="true"></i>
                            <span className="ns-visually-hidden">Error:</span> Please enter a valid Username. Username must be between 5 and 30 characters long and can only contain letters, upper or lowercase, and numbers.
                        </span>
                    </div>
                    <input className="ns-input fw-30" type="text" id="username" name="username" maxLength="20" value={formData.username} onChange={handleChange} />
                    <br />
                    <label className="ns-label" htmlFor="password">
                        Password:
                    </label>
                    <div id="password-hint" className="ns-hint">
                        Please enter a unique password. A password must be between 8 and 30 characters and must contain at least one of the following special characters: '!', '@', '#', '$'
                    </div>
                    <div className="ns-form-group-message-error">
                        <span id="password-error" className="ns-error-message" hidden={formValid.password}>
                            <i className="fa fa-exclamation-circle error-indicator errorAlert" aria-hidden="true"></i>
                            <span className="ns-visually-hidden">Error:</span> Please enter a valid password. The password cannot be shorter than 8, or longer than 30, characters and must contain one of '!', '@', '#', '$'
                        </span>
                    </div>
                    <input className="ns-input fw-30" type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    <br />
                    <label className="ns-label" htmlFor="email">
                        Email address:
                    </label>
                    <div id="email-hint" className="ns-hint">
                        A verification link will be sent to your email. (Not really)
                    </div>
                    <div className="ns-form-group-message-error">
                        <span id="email-error" className="ns-error-message" hidden={formValid.email}>
                            <i className="fa fa-exclamation-circle error-indicator errorAlert" aria-hidden="true"></i>
                            <span className="ns-visually-hidden">Error:</span> Enter an email address in the correct format, like name@example.com
                        </span>
                    </div>
                    <input className="ns-input fw-25" id="email" name="email" type="email" spellCheck="false" aria-describedby="email-hint" autoComplete="email" value={formData.email} onChange={handleChange} />
                    <br />
                    <label className="ns-label" htmlFor="firstName">
                        First Name:
                    </label>
                    <div id="firstName-hint" className="ns-hint">
                        Please enter your first name.
                    </div>
                    <div className="ns-form-group-message-error">
                        <span id="firstName-error" className="ns-error-message" hidden={formValid.firstName}>
                            <i className="fa fa-exclamation-circle error-indicator errorAlert" aria-hidden="true"></i>
                            <span className="ns-visually-hidden">Error:</span> Please enter a valid first name. It cannot be longer than 35 characters and cannot contain more than one '-' or ' '
                        </span>
                    </div>
                    <input className="ns-input fw-30" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                    <br />
                    <label className="ns-label" htmlFor="lastName">
                        Last Name:
                    </label>
                    <div id="lastName-hint" className="ns-hint">
                        Please enter your last name.
                    </div>
                    <div className="ns-form-group-message-error">
                        <span id="lastName-error" className="ns-error-message" hidden={formValid.lastName}>
                            <i className="fa fa-exclamation-circle error-indicator errorAlert" aria-hidden="true"></i>
                            <span className="ns-visually-hidden">Error:</span> Please enter a valid last name. It cannot be longer than 60 characters and cannot contain more than one '-' or ' '
                        </span>
                    </div>
                <input className="ns-input fw-30" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                <br />
                </div>
                <button className="btn-lg btn-success mt-4 mb-4" type='submit'>Confirm and submit</button> 
                
                &nbsp;&nbsp;&nbsp;<button className="btn-lg btn-default" onClick={goToLogin}>Back to Login</button>
            </form>
        </div>
    );
};

export default Registration;