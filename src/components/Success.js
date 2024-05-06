import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios to make HTTP requests

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Define userData based on the searchParams
  const userData = {
    email: searchParams.get('email'),
    phone: searchParams.get('phone'),
    firstName: searchParams.get('username'),
    lastName: searchParams.get('lastName'),
    amount: searchParams.get('amount'),
    userIdNumber: searchParams.get('idnumber'), // Assuming this is passed as a URL parameter
    cart: JSON.parse(decodeURIComponent(searchParams.get('cart') || '[]'))
  };
  const serializeUserData = (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (key === 'cart') {
        params.append(key, encodeURIComponent(JSON.stringify(data[key])));
      } else {
        params.append(key, data[key]);
      }
    });
    return params.toString();
  };
  const handleNavigation = () => {
    const userDataString = serializeUserData(userData);
    navigate(`/qrcodedisplay?${userDataString}`, { replace: true });
  };

// Function to allocate tickets and update the quantity
const allocateAndUpdateTickets = async () => {
  userData.cart.forEach(async (item) => {
      try {
        console.log(`Allocating Ticket ID: ${item.ticket_id}, Quantity: ${item.quantity}, User ID: ${userData.userIdNumber}`); // Log the details before making the request
        const response = await axios.post('https://ticket.julyoceanlounges.com/api/update-ticket-quantity', {
              ticketId: item.ticket_id,
              userIdNumber: userData.userIdNumber,
              quantity: item.quantity
          });
          console.log(response.data.message);
      } catch (error) {
          console.error('Error updating ticket quantity:', error.response?.data?.message || error.message);
      }
  });
};

useEffect(() => {
  sendDataToBackend();
  allocateAndUpdateTickets();
  handleNavigation(); // Now calls to update the ticket quantities
}, []);

  // Function to allocate tickets
  const allocateTicket = async (ticketId, userIdNumber) => {
    try {
      const response = await axios.post('https://ticket.julyoceanlounges.com/api/allocate-ticket', {
        ticketId,
        userIdNumber
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error allocating ticket:', error.response.data.message);
    }
  };

  // Send data to the backend when the component mounts
  const sendDataToBackend = async () => {
    try {
        const response = await axios.post('https://ticket.julyoceanlounges.com/process-data', userData);
        console.log('Backend response:', response.data);
    } catch (error) {
        console.error('Failed to send data to backend:', error);
    }
};

  useEffect(() => {
    sendDataToBackend();

    // Allocate tickets after successful payment verification
    userData.cart.forEach(item => {
      allocateTicket(item.ticket_id, userData.userIdNumber); // Allocate each ticket in the cart to the user
    });
  }, []); // Empty dependency array ensures this runs once after initial render

  // CSS for centering and styling
  const centerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh', // This sets the height of the container to full viewport height
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0
  };

  const listItemStyle = {
    backgroundColor: '#fff',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  return (
    <div style={centerStyle}>
      <h1>Payment Successful!</h1>
      <p>Email: {userData.email}</p>
      <p>Phone: {userData.phone}</p>
      <p>Name: {userData.firstName} {userData.lastName}</p>
      <p>ID number: {userData.userIdNumber}</p>
      <p>Total Amount Paid: R{parseFloat(userData.amount).toFixed(2)}</p>
      <h2>Items Purchased</h2>
      <ul style={listStyle}>
        {userData.cart.map((item, index) => (
          <li key={index} style={listItemStyle}>
            {item.ticketname} - Seat No: {item.sitting_number} - Ticket ID: {item.ticket_id} - Quantity: {item.quantity} - Price: R{parseFloat(item.price).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Success;
