import { useState } from "react";
import "../css/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    console.log("Logging in:", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome</h2>

        {error && <p className="error-msg">{error}</p>}

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
              placeholder="Enter your password"
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
        <button className="signup-btn">Sign up</button>
      </div>
    </div>
  );
}

export default Login;
