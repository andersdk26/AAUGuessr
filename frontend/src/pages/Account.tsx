import { Navigate } from "react-router-dom";
import "../App.css";
import Button from "../components/Button";

/**
 * Account page
 * @returns Account page
 */
function Account() {
    const isAuthenticated = !!localStorage.getItem("accessToken");

    return !isAuthenticated ? (
        <Navigate to="/login" />
    ) : (
        <>
            <h1>Account</h1>
            <Button
                onClick={() => {
                    localStorage.removeItem("accessToken");
                    window.location.reload();
                }}
            >
                Log out
            </Button>
        </>
    );
}

export default Account;
