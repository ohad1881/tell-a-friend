import "../css/header.css";
import "../css/chooseToDo.css";
import "../css/info.css";
import "../css/stars.css";
import "../css/RatedRest.css";
import StarRating from "../StarRating";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuth";

function Rate() {
  return (
    <div className="appGrid">
      <Header />
      <Choose />
      <Info />
    </div>
  );
}
function Header() {
  return (
    <div className="header">
      <h1 className="title">🍕 Tell A Friend 🍜</h1>

      <svg
        className="userIcon"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="black"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3-6.7-5-10-5z" />
      </svg>
    </div>
  );
}
function Choose() {
  const navigate = useNavigate();

  return (
    <div className="ChooseToDo">
      <button className="btnChoose1" onClick={() => navigate("/whoslikeme")}>
        Who's like me? 👬
      </button>
      <button className="btnChoose2" onClick={() => navigate("/rate")}>
        Ratings ⭐
      </button>
    </div>
  );
}
function Info() {
  return (
    <div className="info">
      <RatedRestaurants />
      <ChooseSubject />
    </div>
  );
}
function RatedRestaurants() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    async function fetchRated() {
      const res = await fetch(
        `http://localhost:3001/ratedRestaurants?email=${user.email}`
      );
      const data = await res.json();
      setRestaurants(data.restaurants || []);
    }

    fetchRated();
  }, []);
  return (
    <div className="ratedRestGrid">
      <h1 className="ratedRestTitle">Restaurants you've Rated</h1>
      {restaurants.length === 0 && <p>No rated restaurants yet.</p>}
      <p className="update-msg">
        - if you want to update some rating, just rate the restaurant again -
      </p>
      <ul className="restList">
        {restaurants.map((r) => (
          <li key={r.rest_id} className="restElement">
            <strong>{r.rest_name}</strong> — Food: {r.food}, Service:{" "}
            {r.service}, Atmosphere: {r.atmo}, VFM: {r.vfm}
          </li>
        ))}
      </ul>
    </div>
  );
}
function ChooseSubject() {
  return (
    <div className="chooseSubject">
      <h1 className="chooseHeader">choose</h1>
      <div className="subjectsFlex">
        <button className="subjectBtn">restaurants 🍔</button>
      </div>
    </div>
  );
}
export default Rate;
