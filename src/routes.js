import { Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Login from "./components/account/Login";
import Register from "./components/account/Register";
import ResetPassword from "./components/account/ResetPassword";
import Error404 from "./components/Error404";

const routes = () => (
    <App>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/reset-password" element={<ResetPassword />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/profile" />
            <Route path="*" element={<Error404 />}/>
        </Routes>
    </App>
)

export default routes