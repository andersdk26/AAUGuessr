import { useContext } from "react";
import AuthContext, { AuthContextType } from "./AuthContext";

// Hook to access the authentication context
const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
};

export default useAuth;
