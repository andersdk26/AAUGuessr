import "../App.css";
import Button from "../components/Button";
import { useRef, useEffect } from "react";
import useAuth from "../components/authentication/useAuth";

/**
 * Account page
 * @returns Account page
 */
function Account() {
    const accessTokenRef = useRef<HTMLInputElement>(null);
    const { accessToken, setAccessToken } = useAuth();

    useEffect(() => {
        console.log(`Current access token: ${accessToken}`);
    }, [accessToken]);

    return (
        <>
            <h1>Account</h1>
            {/* Logout button */}
            <Button
                onClick={() => {
                    async function logout() {
                        const response = await fetch(
                            "http://localhost:5173/api/user/logout",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                credentials: "include", // Include cookies in the request
                            }
                        );
                        if (response.ok && response.status === 200) {
                            window.location.reload();
                        } else {
                            alert("Failed to log out. Please try again.");
                        }
                    }
                    logout();
                }}
            >
                Log out
            </Button>
            {/* Change accessToken */}
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInputGroup1"
                        placeholder="access token"
                        ref={accessTokenRef}
                    />
                    <label>New access token</label>
                </div>
                <span className="input-group-text">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            if (accessTokenRef.current) {
                                setAccessToken(
                                    accessTokenRef.current?.value || null
                                );
                            }
                        }}
                    >
                        Set
                    </button>
                </span>
            </div>
        </>
    );
}

export default Account;
