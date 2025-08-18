import React, { useState, ReactNode } from "react";
import AuthContext from "./AuthContext";

// AuthProvider component to provide authentication context to the application
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
