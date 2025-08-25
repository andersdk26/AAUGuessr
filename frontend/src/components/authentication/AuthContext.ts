import { createContext } from "react";

export type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
};

// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

// A simple event emitter for token changes
type TokenListener = (token: string | null) => void;
const listeners: TokenListener[] = [];

// Function to set the auth token in apiFetch
export const onTokenChange = (listener: TokenListener) => {
    listeners.push(listener);
};

// Function to emit token changes to all listeners
export const emitTokenChange = (token: string | null) => {
    listeners.forEach((l) => l(token));
};
