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
            <Button
                onClick={() => {
                    window.location.reload();
                }}
            >
                Log out
            </Button>
        </>
    );
}

export default Account;
