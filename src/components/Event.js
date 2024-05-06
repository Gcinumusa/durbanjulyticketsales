import React, { useState } from 'react';
import axios from 'axios';

const Event = () => {
  const [formData, setFormData] = useState({
    eventname: '',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ticket.julyoceanlounges.com/add-event', formData);
      alert('Event added successfully!');
      console.log(response.data);
    } catch (error) {
      alert('Failed to add event: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Add New Event</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="eventname" placeholder="Event Name" value={formData.eventname} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default Event;
