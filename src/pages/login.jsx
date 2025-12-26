import { useEffect, useState } from "react";
import "../css/login.css";
import { useAuth } from "../contexts/FakeAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, isAuthenticated, login } = useAuth();

  const [howManyRated, setHowManyRated] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    const success = await login(email, password);

    if (!success) {
      setError("Wrong email or password");
      return;
    }
  };
  useEffect(
    function () {
      if (!isAuthenticated) return;
      async function fetchRatedCount() {
        try {
          const res = await fetch(
            `http://localhost:3001/howManyRated?email=${user.email}`
          );
          const data = await res.json();
          setHowManyRated(data.how_many_rated || 0);
        } catch (err) {
          console.error("Failed fetching rated count:", err);
        }
      }
      fetchRatedCount();
      navigate("/rate", { replace: true });
    },
    [isAuthenticated, navigate, user?.email]
  );

  return (
    <div className="login-container">
      <p className="title-in-login">Tell a Friend</p>
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
        <button className="signup-btn" onClick={() => navigate("/signup")}>
          Sign up
        </button>
      </div>
    </div>
  );
}

export default Login;
