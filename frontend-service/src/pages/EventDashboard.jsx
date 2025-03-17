import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css"

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    availableSeats: "",
    price: ""
  });
  const isLoggedIn = localStorage.getItem("token") !== null;
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Invalid or missing token:", error);
      return null;
    }
  };
  const userType = decodeToken(localStorage.getItem("token"))?.type;

  // Fetch Events on Page Load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5002/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Handle input change for new event
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Create an event
  const createEvent = async () => {
    try {
      const res = await axios.post("http://localhost:5002/events", newEvent);
      setEvents([...events, res.data]);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // Delete an event
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="dashboard-container">
      { userType === "admin" && 
        <h2 className="dashboard-title">Event Management Dashboard</h2>
      }      
      { isLoggedIn && userType === "admin" &&      
        <>
          <h3 className="section-title">Create New Event</h3>
          <input className="input-field" type="text" name="title" placeholder="Title" onChange={handleChange} required />
          <input className="input-field" type="text" name="description" placeholder="Description" onChange={handleChange} />
          <input className="input-field" type="date" name="date" onChange={handleChange} required />
          <input className="input-field" type="text" name="location" placeholder="Location" onChange={handleChange} required />
          <input className="input-field" type="number" name="availableSeats" placeholder="Available Seats" onChange={handleChange} required />
          <input className="input-field" type="number" name="price" placeholder="Price" onChange={handleChange} required />
          <button className="create-button" onClick={createEvent}>Create Event</button>
        </>
      }

      <h3 className="section-title">All Events</h3>
      <table className="events-table" border="1">
        <thead>
          <tr className="table-header">
            <th className="table-cell">Title</th>
            <th className="table-cell">Date</th>
            <th className="table-cell">Location</th>
            <th className="table-cell">Seats</th>
            <th className="table-cell">Price</th>
            { isLoggedIn && userType === "admin" &&
              <th className="table-cell">Actions</th> 
            }
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr className="table-row" key={event._id}>
              <td className="table-cell">{event.title}</td>
              <td className="table-cell">{new Date(event.date).toLocaleDateString()}</td>
              <td className="table-cell">{event.location}</td>
              <td className="table-cell">{event.availableSeats}</td>
              <td className="table-cell">${event.price}</td>
              { isLoggedIn && userType === "admin" &&
                <td className="table-cell">
                  <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventDashboard;
