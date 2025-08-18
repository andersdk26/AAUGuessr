import { createContext } from "react";

export type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
};

// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
