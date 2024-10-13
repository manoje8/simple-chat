import { useEffect, useRef } from "react";
import "./Menubar.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Menubar = ({ showMenu, handleMenu}) => {
    const {currentUser, logout, isDarkTheme, setIsDarkTheme} = useAuth()
    const navigate = useNavigate()
    const menuRef = useRef();
    
    // Close the menu when user click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
              handleMenu();
            }
        }
      
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
      
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[showMenu, handleMenu])

    // Handler
    const handleLogout = async() => {
        await logout()
        navigate("/login")
    }

    const themeToggle = (e) => {
        setIsDarkTheme(e.target.checked)
    }

    return (
        <div className={`menu-container ${showMenu ? "" : "hidden"}`}>
            <div className= {`menu ${isDarkTheme ? 'dark' : 'light'}`} ref={menuRef} style={{borderColor: isDarkTheme ? '#111': '#fff'}}>
                <ul>
                    <li className="profile my-2">
                        {/* Todo: User can Update Profile */}
                        <img src="https://i.pinimg.com/1200x/51/6c/90/516c90e2161a2212deda34b68ead85fc.jpg" alt="404" />
                        <p className="mx-2">{currentUser.displayName}</p>
                    </li>
                    <li className="menu-list">
                        <p><i className="bi bi-gear"></i></p>
                        <p>Settings</p>
                    </li>
                    <li className="menu-list">
                        <p><i className="bi bi-moon"></i></p>
                        <p>Night Mode</p>
                        <div>
                            <input type="checkbox" id="checkbox" className="checkbox" onChange={themeToggle}/>
                            <label className="checkbox-label" htmlFor="checkbox">
                                <span className="ball"></span>
                            </label>
                        </div>
                    </li>
                    <li className="menu-list text-danger" onClick={handleLogout}>
                        <p><i className="bi bi-box-arrow-right"></i></p>
                        <p>Logout</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Menubar