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
import ProtectedRoute from "./pages/ProtectedRoute";
import SignUp from "./pages/signup";
import WhyPage from "./pages/WhyPage";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="/whylikeme/:email/:username" element={<WhyPage />} />
          <Route
            path="rate"
            element={
              <ProtectedRoute>
                <Rate />
              </ProtectedRoute>
            }
          />
          <Route
            path="whoslikeme"
            element={
              <ProtectedRoute>
                <WhosLikeMe />
              </ProtectedRoute>
            }
          />
          <Route
            path="ratedrest"
            element={
              <ProtectedRoute>
                <RateList />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PNF />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
