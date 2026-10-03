import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api";

function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | allowed | denied

  useEffect(() => {
    api.get("/me")
      .then((res) => {
        setStatus(res.data.is_admin ? "allowed" : "denied");
      })
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "loading") {
    return <div className="p-10 text-center text-gray-500">Đang kiểm tra quyền truy cập...</div>;
  }
  if (status === "denied") {
    return <Navigate to="/" />;
  }
  return children;
}

export default AdminRoute;