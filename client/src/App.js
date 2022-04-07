import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import SocketClient from "./components/SocketClient";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<SocketClient />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
