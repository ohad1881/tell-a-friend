import "./css/header.css";
import "./css/chooseToDo.css";
import "./css/info.css";
import "./css/stars.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Rate from "./pages/Rate";
import WhosLikeMe from "./pages/WhosLikeMe";
import PNF from "./pages/PageNotFound";
import RateList from "./pages/RatedList";
import { AuthProvider } from "./contexts/FakeAuth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="rate" element={<Rate />} />
          <Route path="whoslikeme" element={<WhosLikeMe />} />
          <Route path="ratedrest" element={<RateList />} />
          <Route path="*" element={<PNF />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
