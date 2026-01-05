import "../css/header.css";
import "../css/chooseToDo.css";
import "../css/info.css";
import "../css/stars.css";
import StarRating from "../StarRating";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuth";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./restCard.jsx";

function Rate() {
  return (
    <div className="appGrid">
      <Header />
      <Info />
      <ChooseSubject />
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
      <button className="btnChoose1" onClick={() => navigate("/whoslikeme")}>
        Who's like me? 👬
      </button>
      <button className="btnChoose2 selected">Ratings ⭐</button>
    </div>
  );
}
function Info() {
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [atmos, setAtmos] = useState(0);
  const [vfm, setVfm] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");
  const [resturantChosen, setResturantChosen] = useState(false);
  const [restAddress, setRestAddress] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [restID, setRestID] = useState("");
  const { user, incrementRated } = useAuth();
  const [flashRated, setFlashRated] = useState(false);

  async function handleSearchChange(e) {
    const value = e.target.value;
    setRestaurantName(value);
    setResturantChosen(false);
    setRestAddress("");
    setFood(0);
    setAtmos(0);
    setService(0);
    setVfm(0);
    setRestID("");
  }
  useEffect(() => {
    if (restaurantName.length === 0) {
      setSearchResults([]);
      return;
    }
    if (resturantChosen) return;

    const controller = new AbortController();

    async function getData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/restaurants?name=${encodeURIComponent(
            restaurantName
          )}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Request cancelled");
        } else {
          console.error(err);
        }
      }
    }

    getData();
    return () => controller.abort();
  }, [restaurantName, resturantChosen]);

  async function handleSubmit(e) {
    if (!restaurantName) return alert("Enter a restaurant name!");
    if (!resturantChosen) return alert("Choose a restaurant!");
    if (!food || !service || !atmos || !vfm) {
      return alert("Can't rate 0 stars!");
    }

    console.log(restAddress);
    const res = await fetch(`${process.env.REACT_APP_API}/rateRest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rest_id: restID,
        email: user.email,
        food,
        service,
        atmo: atmos,
        vfm,
        restaurantName,
        restAddress,
      }),
    });

    const data = await res.json();

    if (data.isNewRating) {
      onNewRatingFlash();
      await fetch(`${process.env.REACT_APP_API}/increaseRated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      incrementRated();
    }
  }
  function onNewRatingFlash() {
    setFlashRated(true);
    setTimeout(() => setFlashRated(false), 800);
  }
  return (
    <div className="info">
      <RateSubject
        restaurantName={restaurantName}
        setRestaurantName={setRestaurantName}
        handleSubmit={handleSubmit}
        setFood={setFood}
        setService={setService}
        setAtmos={setAtmos}
        setVfm={setVfm}
        handleSearchChange={handleSearchChange}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        setRestAddress={setRestAddress}
        resturantChosen={resturantChosen}
        setResturantChosen={setResturantChosen}
        setRestID={setRestID}
        onNewRatingFlash={onNewRatingFlash}
        flashRated={flashRated}
        restAddress={restAddress}
      />
    </div>
  );
}
function RateSubject({
  restaurantName,
  setRestaurantName,
  handleSubmit,
  setFood,
  setAtmos,
  setService,
  setVfm,
  handleSearchChange,
  searchResults,
  setSearchResults,
  setRestAddress,
  resturantChosen,
  setResturantChosen,
  setRestID,
  onNewRatingFlash,
  flashRated,
  restAddress,
}) {
  const navigate = useNavigate();
  const { howManyRated } = useAuth();
  const [isInfo, setIsInfo] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <div className="RateGrid">
      <Choose />
      <h1 className="infoHeadertitle">Rate a restaurant!</h1>

      <div className="flexSearchAndRate">
        {/* Info tooltip */}
        <InfoIcon
          className="infoIcon"
          onMouseEnter={() => setIsInfo(true)}
          onMouseLeave={() => setIsInfo(false)}
        />
        {isInfo && (
          <div className="infoBubble">
            Rate honestly! This isn’t Google Maps - no need to be nice just to
            avoid hurting the owner’s feelings 😅 The more accurate you rate,
            the better your matches will be.
          </div>
        )}

        {/* Search + Rating Form */}
        <form
          className="chooseForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            className="inputForm"
            placeholder="Add a restaurant..."
            value={restaurantName}
            onChange={handleSearchChange}
          />

          {searchResults?.length > 0 && (
            <div className="searchDropdown">
              {searchResults.map((r) => (
                <div
                  key={r.place_id}
                  className="searchItem"
                  onClick={() => {
                    console.log(r);
                    setRestaurantName(r.name);
                    setRestAddress(r.formatted_address);
                    setResturantChosen(true);
                    setSearchResults([]);
                    setRestID(r.place_id);
                    setSelectedRestaurant(r);
                  }}
                >
                  <strong>{r.name}</strong>
                  <div className="smallAddress">{r.formatted_address}</div>
                </div>
              ))}
            </div>
          )}

          {resturantChosen && (
            <div className="seperateTheCard">
              <div className="rate">
                <div className="flexWithStars">
                  <h1>Food:</h1>
                  <StarRating onChange={setFood} />
                </div>

                <div className="flexWithStars">
                  <h1>Service:</h1>
                  <StarRating onChange={setService} />
                </div>

                <div className="flexWithStars">
                  <h1>Atmosphere:</h1>
                  <StarRating onChange={setAtmos} />
                </div>

                <div className="flexWithStars">
                  <h1>VFM:</h1>
                  <StarRating onChange={setVfm} />
                </div>
                <button className="addBtn" type="submit">
                  Add
                </button>
              </div>

              <div className="restBoxChoosen">
                <RestaurantCard restaurant={selectedRestaurant} />
              </div>
            </div>
          )}
        </form>

        {/* Flash button */}
        <button
          className={`btnRest ${flashRated ? "flashRated" : ""}`}
          onClick={() => navigate("/ratedrest")}
        >
          Ratings ⭐️ ({howManyRated})
        </button>
      </div>

      {!resturantChosen && (
        <h1 className="chooseRestMsg">Choose a restaurant!</h1>
      )}
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
function InfoIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line
        x1="12"
        y1="10"
        x2="12"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}
export default Rate;
