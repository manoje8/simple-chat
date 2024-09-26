import { Navigate, replace } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const withAuth = (WrapperComponent) => props => {
    const {currentUser }= useAuth();

    if(!currentUser)
    {
        return <Navigate to={"/login"} replace/>
    }

    return <WrapperComponent {...props} />
}

export default withAuth