import React from 'react'
import { useNavigate} from 'react-router-dom';
import './styles/Header.css'

export default function Header() {
    const navigate = useNavigate();
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
  return (
    <div className='header'>
        <h1>Event Booking System</h1>
        {isLoggedIn && 
            <nav>
                <ul>
                    {/* { userType !== 'admin' && 
                        <>
                            <li><a href="/">Home</a></li>
                            <li><a href="/event-dashboard">Events</a></li>
                            <li><a href="/user-dashboard">My Bookings</a></li>
                        </>
                    }                     */}
                    <li><button className="logout-button" onClick={() => {
                        navigate("/login")
                        localStorage.removeItem("token");
                        window.location.reload();
                    }}>Logout</button></li>
                </ul>
            </nav>
        }
        {!isLoggedIn &&
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/event-dashboard">Events</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/signup">Signup</a></li>
                </ul>
            </nav>
        }
    </div>
  )
}
