import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import UserDatabases from "./pages/UserDatabases/UserDatabases";
import ApiList from "./pages/ApiList/ApiList";

function App() {
  localStorage.setItem("user_id", 1)
  return (
    <BrowserRouter>
      <Layout>
        <div className="App">
          <Routes>
            <Route path="/" element={<UserDatabases />} />
            <Route path="/api" element={<ApiList />} />
          </Routes>
        </div>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
