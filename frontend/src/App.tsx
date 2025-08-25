import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import pageList from "./pages/pagesList";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import { useEffect } from "react";
import useAuth from "./components/authentication/useAuth";

// Pages
import Home from "./pages/Home";
import HttpTest from "./pages/HttpTest";
import Bootstrap from "./pages/Bootstrap";
import Account from "./pages/Account";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
    const { accessToken } = useAuth();

    useEffect(() => {
        console.log("ProtectedRoute accessToken:", accessToken);
    }, [accessToken]);

    return (
        <>
            <BrowserRouter>
                <NavBar pages={pageList} title="AAUGuessr" />
                <Routes>
                    {/* Default routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/http_test/:id" element={<HttpTest />} />
                    <Route
                        path="/http_test"
                        element={<Navigate to="/http_test/1" />}
                    />
                    <Route path="/bootstrap/:tab" element={<Bootstrap />} />
                    <Route
                        path="/bootstrap"
                        element={<Navigate to="/bootstrap/overview" />}
                    />
                    {/* Account routes */}
                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <Account />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    {/* Error routes */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
