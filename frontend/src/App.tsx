import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import pageList from "./pages/pagesList";
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import HttpTest from "./pages/HttpTest";
import Bootstrap from "./pages/Bootstrap";
import Account from "./pages/Account";
import Login from "./pages/login";
function App() {
    return (
        <>
            <NavBar pages={pageList} title="AAUGuessr" />
            <BrowserRouter>
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
                    <Route path="/account" element={<Account />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
