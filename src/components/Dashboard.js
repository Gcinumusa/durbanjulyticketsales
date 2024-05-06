import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user]);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://ticket.julyoceanlounges.com/api/user-tickets?userIdNumber=${user.idnumber}`);
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user details stored in the state, context, or local storage
    navigate('/login'); // Redirect to login or home page after logout
  };

  const navigateToChairs = () => {
    navigate('/Chairs', { state: { user } });
  };

  const navigateToTickets = () => {
    navigate('/tickets', { state: { user } });
  };
  if (!user) {
    return <div>No user data available. Please log in.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Last Name:</strong> {user.lastname}</p>
        <p><strong>ID Number:</strong> {user.idnumber}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div>
        <h2>Your Tickets</h2>
        {loading ? (
                <p>Loading tickets...</p>
              ) : tickets.length > 0 ? (
                <div className="ticket-container"> {/* Flex container */}
                  {tickets.map(ticket => (
                    <div key={ticket.ticket_id} className="ticket-item">
              <h3>{ticket.ticketname}</h3>
              <p>{ticket.description}</p>
              <p>Price: ${Number(ticket.price).toFixed(2)}</p>
              <p>Quantity: {ticket.amountoftickets}</p>
              <p>Type: {ticket.type}</p>
              <p>Sitting Number: {ticket.sitting_number}</p>
              <p>Date of Event: {new Date(ticket.date_of_event).toLocaleDateString()}</p>
              <img src={`https://ticket.julyoceanlounges.com/qr_${ticket.sitting_number}.png`} alt="QR Code" />
                <a href={`https://ticket.julyoceanlounges.com/qr_${ticket.sitting_number}.png`} download={`QR_${ticket.sitting_number}.png`}>
                    Download QR Code
                </a>
              </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No tickets found.</p>
          <button onClick={navigateToChairs}>Browse Chairs</button>
          <button onClick={navigateToTickets}>Browse Tickets</button>
        </div>
        )}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
