// src/App.tsx
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import TenantAdmin from './pages/Tenant.Admin';
import TenantLanding from "./pages/TenantLanding";

function App() {
  return (
       <Router>
        <Routes>
           <Route path="/" element={<TenantLanding/>}/>
          <Route path="/app" element={<LandingPage/>}/>
          <Route path="/admin" element={<TenantAdmin/>}/>
        </Routes>
       </Router>
  );
}

export default App;
