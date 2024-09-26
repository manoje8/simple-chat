import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Navbar = () => {
    const {setMessageReciever,isDarkTheme, setIsDarkTheme} = useAuth();
    const navigate = useNavigate()
    const {logout} = useAuth()

    const handleLogout = async() => {
        await logout()
        navigate("/login")
        setMessageReciever(null)
    }

    const themeToggle = () => {
        setIsDarkTheme(!isDarkTheme)
    }

    return (
        <div className="container-fluid">
            <nav className="navbar">
                    <h4 className="lead">Chat Bot</h4>
                    <div className="nav-right">
                        <h4><i className="bi bi-brilliance" onClick={themeToggle}></i></h4>
                        <h4><i className="bi bi-person"></i></h4>
                        <h4 onClick={handleLogout}><i className="bi bi-box-arrow-left"></i></h4>
                    </div>
            </nav>
        </div>
    )
}

export default Navbar