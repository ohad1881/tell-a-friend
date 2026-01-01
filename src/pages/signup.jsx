import { useState } from "react";
import "../css/login.css";
import { Navigate, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMsg("");

    try {
      setSuccessMsg("loading...");
      const res = await fetch(`${process.env.REACT_APP_API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();
      setSuccessMsg("");
      if (!data.success) {
        setError(data.error || "Signup failed");
        return;
      }

      setSuccessMsg("Account created! now Login!");
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <p className="title-in-login">Tell a Friend</p>
      <div className="login-box">
        <h2 className="login-title">Sign Up!</h2>

        {error && <p className="error-msg">{error}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
            />
          </div>
          <div className="input-group">
            <label>user name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a user name"
            />
          </div>

          <button className="signup-btn" type="submit">
            Sign up
          </button>
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
