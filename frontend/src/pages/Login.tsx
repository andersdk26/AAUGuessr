import { Navigate } from "react-router-dom";
import "../App.css";
import { useState } from "react";
import Button from "../components/Button";
import Alert from "../components/Alert";

/**
 * Log-in/sign up page
 * @returns Log-in/sign-up page
 */
function Login() {
    const isAuthenticated = !!localStorage.getItem("userToken");
    const [signUp, setSignUp] = useState(false);
    const [staySignedIn, setStaySignedIn] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    let alertTimeout: NodeJS.Timeout;
    const [passwordHelpBlock, setPasswordHelpBlock] = useState({
        char: false,
        letter: false,
        number: false,
        special: false,
    });
    const [passwordFilledOut, setPasswordFilledOut] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Get user input
        const email = (e.target as HTMLFormElement).elements.namedItem(
            "floatingEmail"
        ) as HTMLInputElement;
        const password = (e.target as HTMLFormElement).elements.namedItem(
            "floatingPassword"
        ) as HTMLInputElement;
        const staySignedIn = (e.target as HTMLFormElement).elements.namedItem(
            "staySignedIn"
        ) as HTMLInputElement;
        console.log(
            `Email: ${email.value}, Password: ${password.value}, Stay signed in: ${staySignedIn.checked}`
        );

        // Validate user input
        if (!validateEmail(email.value)) {
            console.error("Invalid email.");
            alert("Invalid email or password");
            return;
        }
        if (!validatePasswordBool(password.value)) {
            console.error("Invalid password.");
            alert("Invalid email or password");
            return;
        }

        // Send user input to server
        const response = await fetch("http://localhost:8000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        });

        // Handle server response
        if (response.ok && response.status === 200) {
            const data = await response.json();

            if (data.status !== "success") {
                alert("Invalid email or password");
                return;
            }

            console.log(data);
            localStorage.setItem("userToken", data.token);
            <Navigate to="/" />;
        } else {
            console.error("Failed to log in.");
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Get user input
        const username = (e.target as HTMLFormElement).elements.namedItem(
            "floatingUsername"
        ) as HTMLInputElement;
        const email = (e.target as HTMLFormElement).elements.namedItem(
            "floatingEmail"
        ) as HTMLInputElement;
        const password = (e.target as HTMLFormElement).elements.namedItem(
            "floatingPassword"
        ) as HTMLInputElement;
        const confirmPassword = (
            e.target as HTMLFormElement
        ).elements.namedItem("floatingConfirmPassword") as HTMLInputElement;
        const staySignedIn = (e.target as HTMLFormElement).elements.namedItem(
            "staySignedIn"
        ) as HTMLInputElement;
        console.log(
            `Username: ${username.value}, Email: ${email.value}, Password: ${password.value}, Confirm Password: ${confirmPassword.value}, Stay signed in: ${staySignedIn.checked}`
        );

        // Validate user input
        if (!validateUsername(username.value)) {
            console.error("Invalid username.");
            alert("Invalid username");
            return;
        }
        if (!validateEmail(email.value)) {
            console.error("Invalid email.");
            alert("Invalid email");
            return;
        }
        if (password.value !== confirmPassword.value) {
            console.error("Passwords do not match.");
            alert("Passwords do not match");
            return;
        }
        if (!validatePasswordBool(password.value)) {
            console.error("Invalid password.");
            alert("Invalid password");
            return;
        }

        // Send user input to server
        const response = await fetch("http://localhost:8000/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value,
            }),
        });

        // Handle server response
        if (response.ok && response.status === 200) {
            const data = await response.json();

            if (data.status !== "success") {
                alert("Invalid email or password");
                return;
            }

            console.log(data);
            localStorage.setItem("userToken", data.token);
            <Navigate to="/" />;
        } else {
            console.error("Failed to log in.");
        }
    };

    const passwordMatchHandler = () => {
        const password = (
            document.getElementById("floatingPassword") as HTMLInputElement
        ).value;
        const confirmPassword = (
            document.getElementById(
                "floatingConfirmPassword"
            ) as HTMLInputElement
        ).value;

        if (password === confirmPassword || confirmPassword === "") {
            // If the password is empty, don't show the error message
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    };

    // Helper functions
    const validateEmail = (email: string) => {
        const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(email);
    };

    const validatePasswordBool = (password: string) => {
        const re =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/;
        return re.test(password);
    };

    const validateUsername = (username: string) => {
        const re = /^[a-zA-Z0-9_-]{4,20}$/;
        return re.test(username);
    };

    const validatePasswordObject = (password: string) => {
        const reChar = /^.{8,32}$/;
        const reLetter = /[A-Za-z]/;
        const reNumber = /\d/;
        const reSpecial = /[@$!%*#?&]/;
        return {
            char: reChar.test(password),
            letter: reLetter.test(password),
            number: reNumber.test(password),
            special: reSpecial.test(password),
        };
    };

    const passwordHelpBlockTextColor = (
        filledOut: boolean,
        sufficient: boolean
    ) => {
        return filledOut ? (sufficient ? "text-success" : "text-danger") : "";
    };

    const alert = (msg: string) => {
        clearTimeout(alertTimeout);
        setAlertMessage(msg);
        setShowAlert(true);
        alertTimeout = setTimeout(() => setShowAlert(false), 5000);
    };

    return isAuthenticated ? ( // If user is already authenticated, redirect to home page
        <Navigate to="/" />
    ) : signUp ? ( // If user is not authenticated, show log-in/sign-up page
        <form
            className="login-from needs-validation position-absolute top-50 start-50 translate-middle container-sm border border-light rounded"
            onSubmit={handleSignUp}
        >
            <h1 className="text-center mb-4">Sign up</h1>
            {showAlert && (
                <>
                    <Alert type="danger">{alertMessage}</Alert>
                </>
            )}
            {/* Username */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingUsername"
                    key={"floatingUsername"}
                    placeholder="username"
                    required
                ></input>
                <label>Username</label>
            </div>
            {/* Email */}
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    key={"floatingEmail"}
                    placeholder="user@email.com"
                    required
                ></input>
                <label>Email</label>
            </div>
            {/* Password */}
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    key={"floatingPassword"}
                    placeholder="password"
                    required
                    onChange={() => {
                        const password = (
                            document.getElementById(
                                "floatingPassword"
                            ) as HTMLInputElement
                        ).value;
                        setPasswordFilledOut(password.length > 0);
                        setPasswordHelpBlock(validatePasswordObject(password));
                        passwordMatchHandler();
                    }}
                ></input>
                <label>Password</label>
                <div id="passwordHelpBlock" className="form-text">
                    Your password must include:
                    <ul>
                        <li
                            className={passwordHelpBlockTextColor(
                                passwordFilledOut,
                                passwordHelpBlock.char
                            )}
                        >
                            8-32 characters
                        </li>
                        <li
                            className={passwordHelpBlockTextColor(
                                passwordFilledOut,
                                passwordHelpBlock.letter
                            )}
                        >
                            At least one letter
                        </li>
                        <li
                            className={passwordHelpBlockTextColor(
                                passwordFilledOut,
                                passwordHelpBlock.number
                            )}
                        >
                            At least one number
                        </li>
                        <li
                            className={passwordHelpBlockTextColor(
                                passwordFilledOut,
                                passwordHelpBlock.special
                            )}
                        >
                            At least one special character
                        </li>
                    </ul>
                </div>
            </div>
            {/* Confirm Password */}
            <div className="form-floating mb-1">
                <input
                    type="password"
                    className="form-control"
                    id="floatingConfirmPassword"
                    key={"floatingConfirmPassword"}
                    placeholder="password"
                    required
                    onChange={() => {
                        passwordMatchHandler();
                    }}
                ></input>
                <label>Confirm Password</label>
            </div>

            <div className="form-text" style={{ height: "20px" }}>
                {!passwordsMatch && (
                    <p className="text-danger mb-3">Passwords must match</p>
                )}
            </div>

            {/* Stay signed in */}
            <div className="mb-3 form-check mt-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="staySignedIn"
                    key={"staySignedIn"}
                    defaultChecked={staySignedIn}
                    onChange={() => setStaySignedIn(!staySignedIn)}
                ></input>
                <label className="form-check-label">Stay signed in</label>
            </div>
            {/* Submit and Log in buttons */}
            <Button
                className="btn-lg container-fluid"
                formType="submit"
                onClick={() => void 0}
            >
                Sign up
            </Button>
            <Button
                className="container-fluid"
                type="link"
                onClick={() => setSignUp(false)}
            >
                or, log in
            </Button>
        </form>
    ) : (
        <form
            className="login-from needs-validation position-absolute top-50 start-50 translate-middle container-sm border border-light rounded"
            onSubmit={handleLogin}
        >
            <h1 className="text-center mb-4">Log in</h1>
            {showAlert && (
                <>
                    <Alert type="danger">{alertMessage}</Alert>
                </>
            )}
            {/* Email */}
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    key={"floatingEmail"}
                    placeholder="email"
                    required
                ></input>
                <label>Email</label>
                <div className="invalid-feedback">
                    Please provide a valid email.
                </div>
            </div>
            {/* Password */}
            <div className="form-floating">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    key={"floatingPassword"}
                    placeholder="Password"
                    required
                ></input>
                <label>Password</label>
            </div>
            {/* Stay signed in */}
            <div className="mb-3 form-check mt-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="staySignedIn"
                    defaultChecked={staySignedIn}
                    onChange={() => setStaySignedIn(!staySignedIn)}
                ></input>
                <label className="form-check-label">Stay signed in</label>
            </div>
            {/* Submit and Sign up buttons */}
            <Button
                className="btn-lg container-fluid"
                formType="submit"
                onClick={() => void 0}
            >
                Log in
            </Button>
            <Button
                className="container-fluid"
                type="link"
                onClick={() => setSignUp(true)}
            >
                or, sign up
            </Button>
        </form>
    );
}

export default Login;
