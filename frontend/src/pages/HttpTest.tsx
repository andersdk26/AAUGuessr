import { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import "../App.css";

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

    const getHello = async () => {
        try {
            const response: AxiosResponse<messageProps> = await axios.get(
                "http://localhost:8000/hello/Per"
            );
            console.log(response.data);
            setHelloData(response.data.message);
        } catch (error) {
            console.error("Error receiving helloData:", error);
        }
    };

    const getUser = async () => {
        try {
            const response: AxiosResponse<UserTableProps> = await axios.get(
                `http://localhost:8000/user/${id}`
            );
            console.log(response.data);
            setUsername(response.data.username);
        } catch (error) {
            console.error("Error receiving helloData:", error);
        }
    };

    const setUserUsername = async (newUsername: string | null) => {
        if (newUsername == null) {
            return;
        }
        try {
            const response: AxiosResponse<messageProps> = await axios.get(
                `http://localhost:8000/user/username/${id}`,
                {
                    params: {
                        set: newUsername,
                    },
                }
            );
            console.log(response.data);
            if (response.data.status === "success") {
                setUsername(newUsername);
                setShowMessage("Username set successfully");
            } else {
                setShowMessage("Username set failed" + response.data.message);
            }
            setTimeout(setShowMessage, 2000, "");
        } catch (error) {
            console.error("Error receiving helloData:", error);
        }
    };

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
