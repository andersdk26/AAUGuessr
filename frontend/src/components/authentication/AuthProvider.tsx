import React, { useState, ReactNode, useEffect } from "react";
import AuthContext from "./AuthContext";
import { setAuthToken } from "../apiFetch";

// AuthProvider component to provide authentication context to the application
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        setAuthToken(accessToken);
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
