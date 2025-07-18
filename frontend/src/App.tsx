import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import WordBookPage from "./pages/WordBookPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
    return (
        <>
            <AuthProvider>
                <Router>
                    <div>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/register"
                                element={<RegisterPage />}
                            />
                            <Route
                                path="/"
                                element={
                                    //防止没权限但进去， 会自动跳转登录界面
                                    <PrivateRoute>
                                        <HomePage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/chat/:characterId?"
                                element={
                                    <PrivateRoute>
                                        <ChatPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/wordbook"
                                element={
                                    <PrivateRoute>
                                        <WordBookPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <ProfilePage />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </>
    );
};

export default App;
