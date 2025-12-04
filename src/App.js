import "./css/header.css";
import "./css/chooseToDo.css";
import "./css/info.css";
import "./css/stars.css";
import StarRating from "./StarRating";
import { useState } from "react";
function App() {
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
  return (
    <div className="ChooseToDo">
      <button className="btnChoose1">Who's like me? 👬</button>
      <button className="btnChoose2">Ratings ⭐</button>
    </div>
  );
}
function Info() {
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [atmos, setAtmos] = useState(0);
  const [vfm, setVfm] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div className="info">
      <RateSubject
        handleSubmit={handleSubmit}
        setFood={setFood}
        setService={setService}
        setAtmos={setAtmos}
        setVfm={setVfm}
      />
      <ChooseSubject />
    </div>
  );
}
function RateSubject({ handleSubmit, setFood, setAtmos, setService, setVfm }) {
  return (
    <div className="infoSubject">
      <h1 className="infoHeader">Rate a restaurant!</h1>
      <div className="flexSearchAndRate">
        <form className="chooseForm" onSubmit={handleSubmit}>
          <input
            className="inputForm"
            placeholder="Add a restaurant..."
          ></input>
          <div className="rate">
            <div className="flexWithStars">
              <h1>Food: </h1>
              <StarRating onChange={setFood} />
            </div>

            <div className="flexWithStars">
              <h1>Service: </h1>
              <StarRating onChange={setService} />
            </div>
            <div className="flexWithStars">
              <h1>Atmosphere: </h1>
              <StarRating onChange={setAtmos} />
            </div>
            <div className="flexWithStars">
              <h1>VFM: </h1>
              <StarRating onChange={setVfm} />
            </div>
          </div>
          <button className="addBtn">Add</button>
        </form>
        <button className="btnRest">restaurants you've rated 🌟 (0)</button>
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
export default App;
