import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import LogMeal from "./pages/LogMeal";
import Dashboard from "./pages/Dashboard";
import WeeklyPlan from "./pages/WeeklyPlan";
import Profile from "./pages/Profile";
import MealHistory from "./pages/MealHistory";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/log-meal" element={<ProtectedRoute><LogMeal /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/weekly-plan" element={<ProtectedRoute><WeeklyPlan /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/meal-history" element={<ProtectedRoute><MealHistory /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminRoute><Admin /></AdminRoute></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;