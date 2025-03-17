import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventDashboard from "./pages/EventDashboard";
import Header from "./components/Header";
import "./App.css";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header></Header>
        <Routes>
          {/* Redirect "/" to "/login" */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-dashboard" element={<Dashboard />} />
          <Route path="/event-dashboard" element={<EventDashboard />} />
          {/* Handle 404 (Page Not Found) */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// React 18 correct root rendering
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
