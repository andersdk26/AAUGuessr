import { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import "../App.css";
import useAuth from "../components/authentication/useAuth";
import apiFetch from "../components/apiFetch";

interface messageProps {
    message: string;
    status: string;
}

interface UserTableProps {
    id: number;
    username: string;
}

/**
 * HTTP test page
 * @returns HTTP test page
 */
function HttpTest() {
    const [username, setUsername] = useState<string>("");
    const [helloData, setHelloData] = useState<string>("");
    const [showMessage, setShowMessage] = useState<string>("");
    const { id } = useParams();
    const usernameRef = useRef<HTMLInputElement>(null);
    const { accessToken } = useAuth();

    // Example GET request
    const getHello = async () => {
        try {
            const response: AxiosResponse<messageProps> = await apiFetch.get(
                `/hello/${id}`
            );
            console.log(response.data);
            setHelloData(response.data.message);
        } catch (error) {
            console.error("Error receiving hello data:", error);
        }
    };

    // Get user data from authenticated user
    const getUser = async () => {
        try {
            const response: AxiosResponse<UserTableProps> = await apiFetch.get(
                `http://localhost:5173/api/user/getusername`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data);
            setUsername(response.data.username);
        } catch (error) {
            console.error("Error receiving user data:", error);
            setUsername("");
        }
    };

    // Set user username for authenticated user
    const setUserUsername = async (newUsername: string | null) => {
        if (newUsername == null) {
            return;
        }
        try {
            const response: AxiosResponse<messageProps> = await axios.get(
                `http://localhost:5173/api/user/setusername`,
                {
                    params: {
                        set: newUsername,
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                setUsername(newUsername);
                setShowMessage("Username changed successfully");
            } else {
                throw new Error(`code: ${response.status}`);
            }
        } catch (error) {
            console.error("Error receiving data:", error);
            setShowMessage("Username change failed");
        }
        setTimeout(setShowMessage, 2000, "");
    };

    // Fetch hello data on component mount
    useEffect(() => {
        getHello();
    }, []);

    return (
        <>
            <h1>HTTP Requests</h1>
            {helloData ? <p>{helloData}</p> : <p>Loading...</p>}
            <h2>User</h2>
            <button type="button" className="btn btn-primary" onClick={getUser}>
                Get username
            </button>
            {username ? <p>Username: {username}</p> : <p>Username: </p>}
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInputGroup1"
                        placeholder="Username"
                        ref={usernameRef}
                    />
                    <label>New Username</label>
                </div>
                <span className="input-group-text">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            setUserUsername(usernameRef.current?.value || null)
                        }
                    >
                        Set
                    </button>
                </span>
            </div>
            {showMessage && (
                <div className="alert alert-primary" role="alert">
                    {showMessage}
                </div>
            )}
        </>
    );
}

export default HttpTest;
