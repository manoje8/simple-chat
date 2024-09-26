import { Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Login from "./components/account/Login";
import Register from "./components/account/Register";
import ResetPassword from "./components/account/ResetPassword";

const routes = () => (
    <App>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/reset-password" element={<ResetPassword />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/profile" />
        </Routes>
    </App>
)

export default routes