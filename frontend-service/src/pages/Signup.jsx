import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", type: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting Form Data:", formData); // ✅ Debugging step
            await axios.post("http://localhost:5004/users/signup", formData);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Signup</h2>
            {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
            <form className="signup-form" onSubmit={handleSubmit}>
                <input 
                    className="signup-input" 
                    type="text" 
                    name="name" 
                    placeholder="Name" 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    className="signup-input" 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    className="signup-input" 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                />
                
                {/* ✅ Change `userType` to `type` */}
                <select 
                    className="signup-select" 
                    name="type" 
                    onChange={handleChange} 
                    required
                > 
                    <option value="">Select User Type</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                </select>

                <button className="signup-button" type="submit">Signup</button>
            </form>
            <p className="login-link">Already have an account? <a href="/login">Login</a></p>
        </div>
    );
};

export default Signup;
