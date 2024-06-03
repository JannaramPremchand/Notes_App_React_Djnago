import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formName = method === "login" ? "Login" : "Register";
    const oppositeRoute = method === "login" ? "/register" : "/login";
    const oppositeAction = method === "login" ? "Register" : "Login";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!username || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Username and password are required',
            });
            setLoading(false);
            return;
        }

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.username?.[0] || error.response?.data?.message || error.message;
            if (method === "register" && errorMessage.includes("Username already exists")) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'Username already exists. Please choose a different username.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Authentication Failed',
                    text: 'Please check your credentials and try again.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="form-container">
                <h1>{formName}</h1>
                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    aria-label="Username"
                />
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                />
                {loading ? <LoadingIndicator /> : <button className="form-button" type="submit">{formName}</button>}

                <p className="form-link">
                    {method === "login" ? "Don't have an account?" : "Already have an account?"}
                    <Link to={oppositeRoute}> {oppositeAction}</Link>
                </p>
            </form>

        </div>
    );
}

export default Form;
