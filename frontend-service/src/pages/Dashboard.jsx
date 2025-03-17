import { useState, useEffect, use } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css"

const BookingDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);
    const [ticketCounts, setTicketCounts] = useState({}); // Store selected ticket counts
    const [editingBooking, setEditingBooking] = useState(null); // Track booking being edited
    const navigate = useNavigate();

    // Fetch Bookings & Events on Page Load
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("http://localhost:5001/bookings");
                setBookings(res.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };

        const fetchEvents = async () => {
            try {
                const res = await axios.get("http://localhost:5002/events");
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchBookings();
        fetchEvents();
    }, []);

    // Handle ticket count change
    const handleTicketChange = (eventId, value) => {
        setTicketCounts({ ...ticketCounts, [eventId]: value });
    };

    const getUserNameByID = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5004/users/${userId}`);
            return res.data.name;  // ✅ Access the `name` field from response
        } catch (err) {
            console.error("Error fetching user:", err);
            return "Unknown User"; // Default name if request fails
        }
    };

    const getEventNameByID = async (eventId) => {
        try {
            const res = await axios.get(`http://localhost:5002/events/${eventId}`);
            return res.data.title;  // ✅ Access the `title` field from response
        } catch (err) {
            console.error("Error fetching event:", err);
            return "Unknown Event"; // Default name if request fails
        }
    };

    const decodeToken = (token) => {
        try {
            if (!token) throw new Error("No token provided");

            const parts = token.split(".");
            if (parts.length !== 3) throw new Error("Invalid token format");

            const decodedPayload = JSON.parse(atob(parts[1])); // Decode JWT payload
            return decodedPayload;
        } catch (error) {
            console.error("Error decoding token:", error.message);
            return null; // Return `null` if the token is invalid
        }
    };

    const refreshBookings = async () => {
        try {
            const res = await axios.get("http://localhost:5001/bookings");

            // Fetch user names and event names asynchronously
            const updatedBookings = await Promise.all(res.data.map(async (booking) => {
                const userName = await getUserNameByID(booking.userId);
                const eventName = await getEventNameByID(booking.eventId);

                return { ...booking, userName, eventName };
            }));

            setBookings(updatedBookings); // ✅ Update state in one call
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    const createBooking = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");

            const decoded = decodeToken(token);
            if (!decoded || !decoded.userId) throw new Error("Invalid token format");
            console.log("Decoded Token:", decoded);

            const numTickets = ticketCounts[eventId] || 1; // Default to 1 if not selected

            const res = await axios.post("http://localhost:5001/bookings", {
                userId: decoded.userId,
                eventId: eventId,
                numTickets: numTickets // Send the selected ticket count
            }, {
                headers: { Authorization: `Bearer ${token}` } // ✅ Send JWT in headers
            });

            const userName = getUserNameByID(decoded.userId);
            const eventName = events.find(event => event._id === eventId).title;

            const booking = {
                ...res.data,
                userName: userName,
                eventName: eventName
            };

            console.log("Booking created:", booking)

            refreshBookings();
        } catch (err) {
            console.error("Error creating booking:", err.message);
        }
    };

    // Update booking tickets
    const updateBooking = async (bookingId, newTickets) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");

            await axios.put(`http://localhost:5001/bookings/${bookingId}`, {
                numTickets: newTickets
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEditingBooking(null);
            refreshBookings();
        } catch (err) {
            console.error("Error updating booking:", err.message);
        }
    };

    // Cancel/delete booking
    const cancelBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");

            // console.log("Booking ID:", bookingId)

            await axios.delete(`http://localhost:5001/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            refreshBookings();
        } catch (err) {
            console.error("Error canceling booking:", err.message);
        }
    };

    useEffect(() => {
        refreshBookings();
    }, []);

    return (
        <div className="booking-dashboard">
            <h2 className="dashboard-title">Booking Management Dashboard</h2>
            {/* <button className="logout-button" onClick={() => navigate("/login")}>Logout</button> */}

            <h3 className="section-title">Available Events</h3>
            <table className="events-table" border="1">
                <thead className="table-header">
                    <tr>
                        <th className="header-cell">Title</th>
                        <th className="header-cell">Date</th>
                        <th className="header-cell">Location</th>
                        <th className="header-cell">Seats</th>
                        <th className="header-cell">Price</th>
                        <th className="header-cell">Tickets</th>
                        <th className="header-cell">Book</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {events.map((event) => (
                        <tr className="event-row" key={event._id}>
                            <td className="event-cell">{event.title}</td>
                            <td className="event-cell">{new Date(event.date).toLocaleDateString()}</td>
                            <td className="event-cell">{event.location}</td>
                            <td className="event-cell">{event.availableSeats}</td>
                            <td className="event-cell">${event.price}</td>
                            <td className="event-cell">
                                <select
                                    className="ticket-select"
                                    value={ticketCounts[event._id] || 1}
                                    onChange={(e) => handleTicketChange(event._id, parseInt(e.target.value))}
                                >
                                    {[...Array(event.availableSeats > 10 ? 10 : event.availableSeats).keys()].map((num) => (
                                        <option className="ticket-option" key={num + 1} value={num + 1}>
                                            {num + 1}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="event-cell">
                                <button className="book-button" onClick={() => createBooking(event._id)}>Book</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="section-title">Your Bookings</h3>
            <table className="bookings-table" border="1">
                <thead className="table-header">
                    <tr>
                        <th className="header-cell">User Name</th>
                        <th className="header-cell">Event Name</th>
                        <th className="header-cell">Tickets</th>
                        <th className="header-cell">Status</th>
                        <th className="header-cell">Actions</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {bookings.map((booking) => (
                        <tr className="booking-row" key={booking.id}>
                            <td className="booking-cell">{booking.userName}</td>
                            <td className="booking-cell">{booking.eventName}</td>
                            <td className="booking-cell">
                                {editingBooking === booking.id ? (
                                    <select
                                        value={ticketCounts[booking.id] || booking.numTickets}
                                        onChange={(e) => handleTicketChange(booking.id, parseInt(e.target.value))}
                                    >
                                        {[...Array(10).keys()].map((num) => (
                                            <option key={num + 1} value={num + 1}>
                                                {num + 1}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    booking.numTickets
                                )}
                            </td>
                            <td className="booking-cell">{booking.status}</td>
                            <td className="booking-cell">
                                {editingBooking === booking.id ? (
                                    <>
                                        <button className="create-button" onClick={() => updateBooking(booking.id, ticketCounts[booking.id])}>
                                            Save
                                        </button>
                                        <button className="create-button" onClick={() => setEditingBooking(null)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="create-button" onClick={() => setEditingBooking(booking.id)}>
                                            Edit
                                        </button>
                                        <button className="create-button" onClick={() => cancelBooking(booking.id)}>
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingDashboard;
