import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Tickets.css";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://ticket.julyoceanlounges.com/api/onetickets", {
        params: { ticketId: 25 },
      })
      .then((response) => {
        const formattedTickets = response.data.map((ticket) => ({
          ...ticket,
          price: parseFloat(ticket.price), // Ensure price is a number
          amountoftickets: parseInt(ticket.amountoftickets), // Ensure amount is an integer
        }));
        setTickets(formattedTickets);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        setError("Failed to fetch tickets");
      });
  }, []);

  const addToCart = (ticket) => {
    const existingTicket = cart.find(item => item.ticket_id === ticket.ticket_id);
    if (existingTicket) {
      // Only increase quantity if it's less than the available amount
      if (existingTicket.quantity < ticket.amountoftickets) {
        setCart(cart.map(item =>
          item.ticket_id === ticket.ticket_id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        alert("No more tickets available to add to cart.");
      }
    } else {
      // Add new ticket with quantity 1
      setCart([...cart, { ...ticket, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (ticketId) => {
    const existingTicket = cart.find(item => item.ticket_id === ticketId);
    if (existingTicket && existingTicket.quantity > 1) {
      // Decrease quantity only if more than one
      setCart(cart.map(item =>
        item.ticket_id === ticketId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      // Remove item if quantity is 1, or do nothing to keep at least 1
      alert("Minimum one ticket must be in the cart.");
    }
  };
  

  const navigateToRegister = () => {
    navigate("/CheckEmail", { state: { cart } }); // Navigate to register page and pass cart data
  };

  return (
    <div className="register-container">
       <div className="register-image">
          <img
            style={{ borderRadius: "20px" }}
            src="https://www.sportingpost.co.za/wp-content/uploads/2024/03/HWB-HDJ-2024-Theme-Reveal-1120x630.jpg"
            alt="Crallan"
          />
        </div>
        <div className="register-form">
      <h1>Choose your ticket</h1>
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <div  key={ticket.ticket_id}>
            <h2>
              {ticket.ticketname} 
            </h2>
            <p>R{ticket.price.toFixed(2)}</p>
            <p>Seat Number: {ticket.sitting_number}</p>
            {/* <p>
              Event Date: {new Date(ticket.date_of_event).toLocaleDateString()}
            </p> */}
            <p>Remaining Tickets: {ticket.amountoftickets}</p>
            {cart.length > 0 && (
        <div>
         
          <h2>Cart</h2>
          {cart.map((item, index) => (
            <div key={index}>
              <p>
                {item.ticketname} - R{item.price.toFixed(2)}
              </p>
              <div style={{
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center'
}}> <button onClick={() => removeFromCart(ticket.ticket_id)} style={{
    backgroundColor: 'white',
    border: '1px solid #000',
    color: 'black',
    padding: '10px',
    fontSize: '26px',
    lineHeight: 1,
    borderRadius: '50%',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s'
  }}>
    -
  </button>


  <p style={{ margin: '0 10px' }}> {item.quantity}</p>
  <button onClick={() => addToCart(ticket)} style={{
    backgroundColor: 'blue',
    border: 'none',
    color: 'white',
    padding: '10px',
    fontSize: '26px',
    lineHeight: 1,
    borderRadius: '50%',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s'
  }}>
    +
  </button>
 
</div>

              {/* <button onClick={() => addToCart(item)} className="add-to-cart">
                Add More
              </button>
              <button
                onClick={() => removeFromCart(item.ticket_id)}
                className="remove-from-cart"
              >
                Remove
              </button> */}
            </div>
          ))}
         
        </div>
      )}
            <button onClick={() => addToCart(ticket)}  className="remove-from-cart">
              Buy
            </button>
           
            <button onClick={navigateToRegister} className="remove-from-cart">
            Proceed to Checkout
          </button>
          </div>
        ))
      ) : (
        <p>Please refresh page to view ticket </p>
      )}
    
      
      
      </div>
    </div>
  );
};

export default Tickets;
