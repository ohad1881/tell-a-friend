import "../css/header.css";
import "../css/chooseToDo.css";
import "../css/info.css";
import "../css/stars.css";
import "../css/WLM.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuth";

function Rate() {
  return (
    <div className="appGrid">
      <Header />
      <Info />
      <ChooseSubject />s
    </div>
  );
}
function Header() {
  const { user, logout, username } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="header">
      <h1 className="title">Tell A Friend</h1>

      <div className="userMenuWrapper">
        <svg
          className="userIcon"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="#9dc7ee"
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
      <button className="btnChoose1 selected">Who's like me? 👬</button>
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
    </div>
  );
}
function WLM() {
  const { user } = useAuth();
  const [mostSimilar, setMostSimilar] = useState([]);
  const [leastSimilar, setLeastSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API}/whoslikeme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      setMostSimilar(data.mostSimilar);
      setLeastSimilar(data.leastSimilar);
      setLoading(false);
    }

    load();
  }, []);
  return (
    <div className="WLMgrid">
      <Choose />
      <h1 className="infoHeader">Who's like me?</h1>
      <div className="GetFamiliarGrid">
        <div className="wnlmInfo">
          <h1 className="WLMtitles">Who's not like me</h1>
          {loading && <p className="loadingMsg">Loading...</p>}
          {!loading && leastSimilar.length === 0 && (
            <p className="RateFirst">
              Either you don’t have any matches yet, or you haven’t rated any
              restaurants yet...
            </p>
          )}
          {leastSimilar.length !== 0 && (
            <p className="ordermsg">
              *Ordered by least similarity. Click “see why” to see what you
              should avoid because they liked it 🤡
            </p>
          )}
          <div className="toscroll">
            {leastSimilar.map((user, index) => (
              <div className="simUser" key={user.username}>
                <h3>
                  {index + 1}. {user.username} (score:
                  {user.weightedSimilarity.toFixed(2)})
                </h3>
                <button
                  className="seeWhy"
                  onClick={() =>
                    navigate(`/whylikeme/${user.email}/${user.username}`, {
                      state: { isLikeMe: false },
                    })
                  }
                >
                  see why
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="wlmInfo">
          <h1 className="WLMtitles">Who's like me</h1>
          {loading && <p className="loadingMsg">Loading...</p>}
          {!loading && mostSimilar.length === 0 && (
            <p className="RateFirst">
              Either you don’t have any matches yet, or you haven’t rated any
              restaurants yet...
            </p>
          )}
          {mostSimilar.length !== 0 && (
            <p className="ordermsg">
              *Sorted by highest similarity. Click “see why” to see what you
              both liked and where they’ve been but you haven’t!
            </p>
          )}
          <div className="toscroll">
            {mostSimilar.map((user, index) => (
              <div className="simUser" key={user.username}>
                <h3>
                  {index + 1}. {user.username} (score:
                  {user.weightedSimilarity.toFixed(2)})
                </h3>
                <button
                  className="seeWhy"
                  onClick={() =>
                    navigate(`/whylikeme/${user.email}/${user.username}`, {
                      state: { isLikeMe: true },
                    })
                  }
                >
                  see why
                </button>
              </div>
            ))}
          </div>
        </div>
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
