import "../css/header.css";
import "../css/chooseToDo.css";
import "../css/info.css";
import "../css/stars.css";
import "../css/WLM.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  const { user, logout } = useAuth();
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
            <p className="helloText">Hello, {user?.email}</p>
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
      <button className="btnChoose1">Who's like me? 👬</button>
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
  return (
    <div className="WLMgrid">
      <h1 className="infoHeader">Who's like me?</h1>
      <div className="GetFamiliarGrid">
        <div className="wnlmInfo">
          <h1 className="WLMtitles">Who's not like me</h1>
          <p className="ordermsg">*Ordered by least familiar</p>
        </div>
        <div className="wlmInfo">
          <h1 className="WLMtitles">Who's like me</h1>
          <p className="ordermsg">*Ordered by most familiar</p>
        </div>
      </div>
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
