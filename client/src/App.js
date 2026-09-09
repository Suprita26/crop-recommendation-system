import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AdminCrops from "./pages/AdminCrops";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/crops"
              element={
                <AdminRoute>
                  <AdminCrops />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
