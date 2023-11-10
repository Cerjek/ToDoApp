import React from 'react';
import "../salitre.css";
import "../font-awesome-4.7.0/css/font-awesome.min.css";

const ErrorMessageDisplay = ({ message }) => {
    //{success, message}
    return (
        <div hidden={!message}>
            <div className="alert-block" aria-label="alert" role="alert">
                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                <div className="alert-message">
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}
export default ErrorMessageDisplay;