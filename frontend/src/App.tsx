import { Routes, Route } from "react-router-dom";
import IssueCredential from "./pages/IssueCredential";
import VerifyCredential from "./pages/VerifyCredential";
import "./App.css";
import Header from "./components/Header";

function App() {

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header/>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
          <Routes>
            <Route path="/" element={<IssueCredential />} />
            <Route path="/issue" element={<IssueCredential />} />
            <Route path="/verify" element={<VerifyCredential />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
