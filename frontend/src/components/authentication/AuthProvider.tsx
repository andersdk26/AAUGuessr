import React, { useState, ReactNode, useEffect } from "react";
import AuthContext from "./AuthContext";
import { setAuthToken } from "../apiFetch";
import { onTokenChange } from "./AuthContext";

// AuthProvider component to provide authentication context to the application
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Update the auth token in apiFetch whenever it changes
    useEffect(() => {
        setAuthToken(accessToken);
    }, [accessToken]);

    // Listen for token changes and update the state accordingly
    useEffect(() => {
        onTokenChange((token) => setAccessToken(token));
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
