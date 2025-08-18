import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

type Props = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
    const { accessToken } = useAuth();
    console.log("ProtectedRoute accessToken:", accessToken);

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
