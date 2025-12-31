import "../css/header.css";
import "../css/chooseToDo.css";
import "../css/info.css";
import "../css/stars.css";
import "../css/WLM.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuth";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../css/whyLikeMe.css";

function WhyLikeMe() {
  return (
    <div className="appGrid">
      <Header />
      <Choose />
      <Info />
    </div>
  );
}
function Header() {
  const { logout, username } = useAuth();
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
      <WLM />
      <ChooseSubject />
    </div>
  );
}
function WLM() {
  const { email, username } = useParams(); // email של השני
  const { user } = useAuth(); // אני
  const [shared, setShared] = useState([]);
  const [heNotMe, setHeNotMe] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLikeMe = location.state?.isLikeMe;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    async function load() {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API}/seewhy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          me: user.email,
          other: email,
          isLikeMe,
        }),
      });

      const data = await res.json();
      setShared(data.sharedRated);
      setHeNotMe(data.heRatedNotMe);
      setLoading(false);
    }

    load();
  }, [email, user, isLikeMe]);

  return (
    <div className="WHYgrid">
      <h1 className="WHYheader">
        {isLikeMe
          ? `Why is ${username} like me?`
          : `Why is ${username} not like me?`}
      </h1>

      <div className="seperate">
        {/* restaurants we both rated */}
        <div className="WHYsection">
          <h2>
            {isLikeMe
              ? `Restaurants we both rated, ordered by most similar`
              : `Restaurants we both rated, ordered by least similar`}
          </h2>
          {loading && <p className="loadingMsg">Loading...</p>}
          <div className="WHYlist">
            {shared.map((r) => (
              <div className="WHYitem" key={r.rest_id}>
                <div className="WHYrestName">{r.rest_name}</div>

                <div className="WHYscores">
                  <strong>You:</strong>, 🍽 Food: {r.my.food}, 🧑‍🍳 Service:
                  {r.my.service}, 🎭 Atmosphere: {r.my.atmo}, 💰 VFM:
                  {r.my.vfm}
                  <br />
                  <br />
                  <strong>{username}:</strong>, 🍽 Food: {r.his.food}, 🧑‍🍳
                  Service: {r.his.service}, 🎭 Atmosphere: {r.his.atmo}, 💰 VFM:
                  {r.his.vfm}
                  <br />
                  <br />⭐ Similarity: {(r.similarity * 100).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* his restaurants i didnt go*/}
        <div className="WHYsection">
          <h2>
            {isLikeMe
              ? `Restaurants he rated but you didn’t, ordered by his favourites`
              : `Restaurants he liked and you should avoid 🤮, ordered by his most favourites`}
          </h2>
          {loading && <p className="loadingMsg">Loading...</p>}
          {!loading && heNotMe.length === 0 && (
            <p className="sameRate">
              {`- you didn't miss any restaurants of ${username}!`}
            </p>
          )}
          {heNotMe.length !== 0 && (
            <div className="WHYlist">
              {heNotMe.map((r) => (
                <div className="WHYitem" key={r.rest_id}>
                  <div className="WHYrestName">{r.rest_name}</div>
                  <div className="WHYrestAdd">📍 -{r.rest_address}-</div>
                  <div className="WHYscores">
                    🍽 Food: {r.food}
                    <br />
                    🧑‍🍳 Service: {r.service}
                    <br />
                    🎭 Atmosphere: {r.atmo}
                    <br />
                    💰 Value: {r.vfm}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="WHYback">
        <button onClick={() => window.history.back()}>⬅ Back</button>
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
export default WhyLikeMe;
