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
        <form
            className="login-from needs-validation position-absolute top-50 start-50 translate-middle container-sm border border-light rounded"
            method="get"
            action="/signup"
        >
            <h1 className="text-center mb-4">Sign up</h1>
            {/* Username */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingUsername"
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
                    placeholder="password"
                    required
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
                    placeholder="password"
                    required
                ></input>
                <label>Confirm Password</label>
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
            method="get"
            action="/login"
        >
            <h1 className="text-center mb-4">Log in</h1>
            {/* Email */}
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
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
