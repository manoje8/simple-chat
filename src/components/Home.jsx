import Chats from "./Chat/Chats"
import Sidebar from "./Chat/Sidebar"
import withAuth from "../context/withAuth";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const {isDarkTheme} = useAuth()
    
    return (
            <div className={`container-fluid ${isDarkTheme ? 'dark' : 'light'}`}>
                <div className="row">
                    <Sidebar />
                    <Chats />
                </div>              
            </div>
    )
}

export default withAuth(Home)