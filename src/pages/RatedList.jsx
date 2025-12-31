import "../css/header.css";
import "../css/chooseToDo.css";
import "../css/info.css";
import "../css/stars.css";
import "../css/RatedRest.css";
import { useEffect, useState } from "react";
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
  const { user, logout, username, howManyRated } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="header">
      <h1 className="title">🍕 Tell A Friend 🍜</h1>

      <div className="userMenuWrapper">
        <svg
          className="userIcon"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="black"
          viewBox="0 0 24 24"
          onClick={() => setOpenMenu((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3-6.7-5-10-5z" />
        </svg>

        {openMenu && (
          <div className="userDropdown">
            <p className="helloText">Hello, {username}</p>
            <button className="logoutBtn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
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
  const { user, decrementRated } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchRated() {
    setLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_API}/ratedRestaurants?email=${encodeURIComponent(
        user.email
      )}`
    );
    const data = await res.json();
    setRestaurants(data.restaurants || []);
    setLoading(false);
  }
  useEffect(() => {
    fetchRated();
  }, []);

  async function handleDelete(id) {
    const delRes = await fetch(`${process.env.REACT_APP_API}/deleteRating`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rest_id: id, email: user.email }),
    });
    setRestaurants([]);
    setLoading(true);
    const delData = await delRes.json();
    if (!delData.success) return alert("Delete failed");
    await fetch(`${process.env.REACT_APP_API}/decreaseRated`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });

    decrementRated();
    fetchRated();
  }
  return (
    <div className="ratedRestGrid">
      <h1 className="ratedRestTitle">Restaurants you've Rated</h1>
      {loading && <p className="loadingMsg">Loading...</p>}
      {restaurants.length === 0 && !loading && (
        <p className="noRatedMsg">- No rated restaurants yet -</p>
      )}
      <div>
        {restaurants.length !== 0 && (
          <p className="update-msg">
            - if you want to update some rating, just rate the restaurant again
            -
          </p>
        )}
        <ul className="restList">
          {restaurants.map((r) => (
            <div className="seeAndDelete" key={r.rest_id}>
              <li className="restElement">
                <strong>{r.rest_name}</strong> — Food: {r.food}, Service:{" "}
                {r.service}, Atmosphere: {r.atmo}, VFM: {r.vfm}
              </li>
              <button className="dlt" onClick={() => handleDelete(r.rest_id)}>
                delete
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
function ChooseSubject() {
  return (
    <div className="chooseSubject">
      <h1 className="chooseHeader">Choose</h1>
      <div className="subjectsFlex">
        <button className="subjectBtn chsActive">Restaurants</button>
      </div>
    </div>
  );
}
export default Rate;
