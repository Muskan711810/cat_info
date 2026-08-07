import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import CatDetail from "./pages/CatDetail";
import AddCat from "./pages/AddCat";

export default function App() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cats/new" element={<AddCat />} />
            <Route path="/cats/:id" element={<CatDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}