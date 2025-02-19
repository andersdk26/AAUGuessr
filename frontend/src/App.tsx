import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import pageList from "./pages/pagesList";
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import HttpTest from "./pages/HttpTest";
import Bootstrap from "./pages/Bootstrap";
import NotFound from "./pages/NotFound";
function App() {
    return (
        <>
            <NavBar pages={pageList} title="AAUGuessr" />
            <BrowserRouter>
                <Routes>
                    {/* <Route>
                        {pageList.map(({ path, dynamicPath, component }) => (
                            <Route
                                path={path + (dynamicPath ? dynamicPath : "")}
                                element={component()}
                                key={path}
                            />
                        ))}
                    </Route> */}
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
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
