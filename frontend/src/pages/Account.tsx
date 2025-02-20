import { Navigate } from "react-router-dom";
import "../App.css";

/**
 * Account page
 * @returns Account page
 */
function Account() {
    const isAuthenticated = !!localStorage.getItem("userToken");

    return !isAuthenticated ? (
        <Navigate to="/login" />
    ) : (
        <>
            <h1>Account</h1>
        </>
    );
}

export default Account;
