import "./css/header.css";
import "./css/chooseToDo.css";
import "./css/info.css";
import "./css/stars.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Rate from "./pages/Rate";
import WhosLikeMe from "./pages/WhosLikeMe";
import PNF from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="rate" element={<Rate />} />
        <Route path="whoslikeme" element={<WhosLikeMe />} />
        <Route path="*" element={<PNF />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
