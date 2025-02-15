// const { Navigate } = require("react-router-dom");
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
    const userData = JSON.parse(localStorage.getItem("user"));

    return (
        userData ? <Outlet /> : <Navigate to={"/login"} />
    )
}

export default PrivateRoute;