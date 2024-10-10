import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"

const withAuth = (WrapperComponent) => props => {
    const {currentUser }= useAuth();
    
    if(!currentUser)
    {
        return <Navigate to={"/login"} />
    }

    return <WrapperComponent {...props} />
}

export default withAuth