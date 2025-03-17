import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const decodeToken = (token) => {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (error) {
            console.error("Invalid or missing token:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5004/users/login", formData);
            const token = res.data.token;

            // Ensure token is a valid JWT
            if (!token || token.split(".").length !== 3) {
                throw new Error("Invalid token received");
            }

            const decoded = decodeToken(token);
            if (!decoded || !decoded.type) throw new Error("Invalid token format");
            console.log(decoded.type);

            localStorage.setItem("token", token);
            if (decoded.type === "admin") {
                navigate("/event-dashboard");
                window.location.reload();
            } else if (decoded.type === "customer") {
                navigate("/user-dashboard");
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <input className="login-input" type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input className="login-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button className="login-button" type="submit">Login</button>
            </form>
            <p className="signup-text">Don't have an account? <a className="signup-link" href="/signup">Signup</a></p>
        </div>
    );
};

export default Login;
