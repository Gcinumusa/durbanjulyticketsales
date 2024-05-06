import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Verify.css'; // Import the CSS module

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, code, cart, user } = location.state;
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState(''); // State to handle error messages

    console.log("Verify in Verify", code);
    console.log("Email in Verify", email);

    const verifyCode = async () => {
        if (inputCode === code.toString()) {
            try {
                const response = await axios.post('https://ticket.julyoceanlounges.com/verify-code', {
                    email: email,
                    code: inputCode
                });
                navigate('/payment', { state: { user, cart } });
            } catch (error) {
                console.error('Verification failed:', error);
                setError('Verification failed. Please try again.');
            }
        } else {
            setError('Incorrect verification code. Please try again.');
        }
    };

    return (
        <div className="container">
            <h1 className="title">Verify Your Email</h1>
            <p>4-digit pin has been sent to <strong>{email}</strong></p>
            <input
                type="text"
                className="inputField"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
            />
            <button className="button" onClick={verifyCode}>
                Verify
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Verify;
