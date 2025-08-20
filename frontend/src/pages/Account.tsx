import "../App.css";
import Button from "../components/Button";

/**
 * Account page
 * @returns Account page
 */
function Account() {
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
        </>
    );
}

export default Account;
