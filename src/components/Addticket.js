import React, { useState } from 'react';
import axios from 'axios';

const AddTicket = () => {
  const [formData, setFormData] = useState({
    ticketname: '',
    description: '',
    price: '',
    amountoftickets: '',
    type: '',
    sitting_number: '',
    image: '',
    date_created: '2024-04-17',
    date_of_event: '2024-04-17',
   
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ticket.julyoceanlounges.com/add-ticket', formData);
      alert('Ticket added successfully!');
      console.log(response.data); // For debugging
    } catch (error) {
      alert('Error adding ticket: ' + error.message);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Ticket</h2>
      {Object.keys(formData).map(key => (
        key !== 'date_created' && (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required={key !== 'image'}  // image is optional
            />
          </div>
        )
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddTicket;
