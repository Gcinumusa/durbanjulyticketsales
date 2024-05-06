import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./register.css";

const AdminScanQR = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  const phone = searchParams.get('phone');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const idnumber = searchParams.get('userIdNumber');
  const amount = searchParams.get('amount');



  const searchParams = new URLSearchParams(location.search);
  const urlEmail = searchParams.get('email');
  const authorizedEmail = 'g@g.g';
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        const response = await axios.get('https://ticket.julyoceanlounges.com/api/tickets-attendance');
        if (response.data && response.data.length > 0) {
          // Assuming the response data is the array of tickets with their attendance status
          const updatedCart = cart.map(item => {
            const found = response.data.find(ticket => ticket.ticket_id === item.sitting_number);
            return found ? {...item, attended: !!found.attended} : item;
          });
          setCart(updatedCart);
        }
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      }
    };
  
    fetchAttendanceStatus();
  }, []); // Only run once on mount
  
  useEffect(() => {
    if (authorizedEmail === verifiedEmail.toLowerCase()) {
      setAccessGranted(true);
      const decodedCart = decodeURIComponent(searchParams.get('cart') || '[]');
      setCart(JSON.parse(decodedCart));
    } else {
      setAccessGranted(false);
      setError('Access denied. You must verify your email to access this page.');
    }
  }, [verifiedEmail]);

  const handleAccess = (e) => {
    e.preventDefault();
    if (email) {
      setVerifiedEmail(email);
    } else {
      setError('Please enter a valid email address.');
    }
  };

  const toggleSoldStatus = async (item, index) => {
    const newIsSold = !item.is_sold;
    const updatedCart = cart.map((cartItem, idx) => idx === index ? {...cartItem, is_sold: newIsSold} : cartItem);
    setCart(updatedCart);

    try {
      await axios.post('http://192.168.8.153/api/update-ticket-sold', {
        ticketId: item.sitting_number,
        isSold: newIsSold
      });
    } catch (error) {
      console.error('Failed to update ticket sold status:', error);
    }
  };
  const toggleAttendanceStatus = async (item, index) => {
    const newAttendance = !item.attended;  
    const originalCart = [...cart];  // Backup original state
    const updatedCart = cart.map((cartItem, idx) => 
      idx === index ? {...cartItem, attended: newAttendance} : cartItem
    );
  
    setCart(updatedCart);  // Optimistically update UI
  
    try {
      const response = await axios.post('https://ticket.julyoceanlounges.com/api/update-ticket-attendance', {
        ticketId: item.sitting_number,
        isAttended: newAttendance
      });
      if (response.status === 200) {
        alert('Attendance status updated successfully.');
      } else {
        throw new Error('Failed to update ticket attendance status');
      }
    } catch (error) {
      console.error('Failed to update ticket attendance status:', error);
      setCart(originalCart);  // Rollback to original state if update fails
      alert('Failed to update attendance status. Please try again.');  // Inform user
    }
  };
  
//   const toggleAttendanceStatus = async (item, index) => {
//     const newAttendance = !item.attended;

//     try {
//       const response = await axios.post('https://ticket.julyoceanlounges.com/api/update-ticket-attendance', {
//         ticketId: item.sitting_number,
//         isAttended: newAttendance
//       });

//       if (response.status === 200) {
//         // Directly update the cart with the response from the server
//         const updatedCart = cart.map((cartItem, idx) => 
//           idx === index ? {...cartItem, attended: newAttendance} : cartItem
//         );
//         setCart(updatedCart);
//         alert('Attendance status updated successfully.');
//       } else {
//         throw new Error('Failed to update ticket attendance status');
//       }
//     } catch (error) {
//       console.error('Failed to update ticket attendance status:', error);
//       alert('Failed to update attendance status. Please try again.');  // Inform user
//     }
// };

  
  if (!accessGranted) {
    return (
      <div className="register-container">
            <div className="register-form">
        <h1>Admin Access</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleAccess}>
          <label>
            Email Address:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>
          <button type="submit">Verify Access</button>
        </form></div>
      </div>
    );
  }

  return (
    <div>
      <h1>QR Code Management Panel</h1>
      <p>Access granted. Welcome, {verifiedEmail}</p>
      <div>
      <h2>User Information</h2>
       <p>Email: {email}</p>
       <p>Phone: {phone}</p>
       <p>Name: {firstName} {lastName} </p>
       <p>ID Number: {idnumber}</p>
        <h3>Cart Items:</h3>
        {cart.map((item, index) => (
          <div key={index}>
            <p>Ticket Name: {item.ticketname} - {item.price}</p>
            <p>Type: {item.type} | Seat Number: {item.sitting_number}</p>
            <p>Date of Event: {new Date(item.date_of_event).toLocaleDateString()}</p>
            <input
  type="checkbox"
  checked={item.attended}
  onChange={() => toggleAttendanceStatus(item, index)}
/> Attended

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminScanQR;
