import React from "react";
import "./styles/Home.css"; 

export default function Home() {
  return (
    <div className="homepage">
      <h1>Event Booking System</h1>
      <p>
        This project is a **Microservices-Based Online Event Booking Platform** 
        that allows users to register, browse events, book tickets, and receive notifications.
        It is integrated with **Jira** for project tracking and **GitHub** for version control.
      </p>

      <h2>Team Members</h2>
      <div className="team">
        <p><strong>Name:</strong> Hamza Ahmed | <strong>Roll No:</strong> 22I-1339</p>
        <p><strong>Name:</strong> Tauha Imran | <strong>Roll No:</strong> 22I-1239</p>
      </div>

      <h2>Project Links</h2>
      <div className="links">
        <a href="https://jira.example.com" target="_blank" rel="noopener noreferrer">🔗 Jira Board</a>
        <a href="https://github.com/example/repo" target="_blank" rel="noopener noreferrer">🔗 GitHub Repository</a>
      </div>
    </div>
  );
}

