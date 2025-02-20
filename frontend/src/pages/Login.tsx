import { Navigate } from "react-router-dom";
import "../App.css";
import { useState } from "react";
import Button from "../components/Button";

/**
 * Log-in/sign up page
 * @returns Log-in/sign-up page
 */
function Login() {
    const isAuthenticated = !!localStorage.getItem("userToken");
    const [signUp, setSignUp] = useState(false);
    const [staySignedIn, setStaySignedIn] = useState(true);

    return isAuthenticated ? (
        <Navigate to="/" />
    ) : signUp ? (
        <form className="login-from position-absolute top-50 start-50 translate-middle container-sm border border-light rounded">
            <h1 className="text-center">Sign up</h1>
            {/* Username */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingUsername"
                    placeholder="username"
                ></input>
                <label>Username</label>
            </div>
            {/* Email */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="user@email.com"
                ></input>
                <label>Email</label>
            </div>
            {/* Password */}
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                ></input>
                <label>Password</label>
                <div id="passwordHelpBlock" className="form-text">
                    Your password must be 8-20 characters long, contain letters,
                    numbers and special characters, and must not contain spaces
                    or emoji.
                </div>
            </div>
            {/* Confirm Password */}
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control"
                    id="floatingConfirmPassword"
                    placeholder="ConfirmPassword"
                ></input>
                <label>Confirm Password</label>
            </div>
            {/* Stay signed in */}
            <div className="mb-3 form-check mt-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="staySignedIn"
                    checked={staySignedIn}
                    onClick={() => setStaySignedIn(!staySignedIn)}
                ></input>
                <label className="form-check-label">Stay signed in</label>
            </div>
            {/* Submit and Log in buttons */}
            <div className="d-flex justify-content-center">
                <Button className="me-3" onClick={() => alert("hej")}>
                    Submit
                </Button>
                <Button
                    className="ms-3"
                    onClick={() => setSignUp(false)}
                    outline
                >
                    Log in
                </Button>
            </div>
        </form>
    ) : (
        <form className="login-from position-absolute top-50 start-50 translate-middle container-sm border border-light rounded">
            <h1 className="text-center">Log in</h1>
            {/* Username or Email */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingUsername"
                    placeholder="username"
                ></input>
                <label>Username or Email</label>
            </div>
            {/* Password */}
            <div className="form-floating">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                ></input>
                <label>Password</label>
            </div>
            {/* Stay signed in */}
            <div className="mb-3 form-check mt-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="staySignedIn"
                    checked={staySignedIn}
                    onClick={() => setStaySignedIn(!staySignedIn)}
                ></input>
                <label className="form-check-label">Stay signed in</label>
            </div>
            {/* Submit and Sign up buttons */}
            <div className="d-flex justify-content-center">
                <Button className="me-3" onClick={() => alert("hej")}>
                    Submit
                </Button>
                <Button
                    className="ms-3"
                    onClick={() => setSignUp(true)}
                    outline
                >
                    Sign up
                </Button>
            </div>
        </form>
    );
}

export default Login;
