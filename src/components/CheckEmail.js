import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Verify.css';
const CheckEmail = () => {
  const [userIdNumber, setUserIdNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = location.state || {};

  const handleUserIdNumberChange = (event) => {
    setUserIdNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://ticket.julyoceanlounges.com/api/check-email?userIdNumber=${encodeURIComponent(userIdNumber)}`);
      const data = await response.json();

      if (data.exists) {
        // If email exists, navigate to Payment with user and cart data
        // Assuming 'cart' is also part of the global state or passed in some other way if needed
       
        navigate('/payment', { state: { user: data.user, cart } });
      } else {
        // If email does not exist, navigate to Register
        navigate('/register', { state: { idNumber : userIdNumber, cart } });
      }
    } catch (err) {
      console.error('Failed to check email:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
   
      <form onSubmit={handleSubmit} className="container">  
       <h1  className="title">Check Email</h1>
        <label htmlFor="userIdNumber" className='mylabel'>Please enter your ID number below to verify if you have an existing account with us. This quick verification helps us securely identify and connect you to your account details.</label>
        <input
          type="text"
          id="userIdNumber" minLength={13} maxLength={13}
          value={userIdNumber}
          placeholder='ID Number'
          className="inputField"
          onChange={handleUserIdNumberChange}
          required
        />
              <button  className="button" type="submit" disabled={loading}>
          {loading ? <div>Loading...</div> : 'Check ID number'}
        </button>  
        </form>
      {error && <div className={styles.errorMessage}>Error: {error}</div>}
    </div>
  );
};

export default CheckEmail;
