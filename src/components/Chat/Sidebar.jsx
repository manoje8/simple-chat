import { useCallback, useEffect, useMemo, useState } from "react"
import { getUsersForSidebar } from "../../service/service"
import { useAuth } from "../../context/AuthContext"
import generateAvatar from "../../utils/avatarHelper"
import './Sidebar.css'
import { useNavigate } from "react-router-dom"

const Sidebar = () => {
    const { contactHandler, isDarkTheme, setIsDarkTheme, logout, currentUser} = useAuth()
    const [allUser, setAllUser] = useState([])
    const [avatar, setAvatar] = useState([])
    const [isActive, setIsActive] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const navigate = useNavigate()

    const fetchUsers = useCallback(async() => {
        const data = await getUsersForSidebar()
        setAllUser(data.users);
        setAvatar(generateAvatar())
        
    },[])

    useEffect(() => {
        fetchUsers()
    },[fetchUsers])

    // Memoize the filtered users to prevent unnecessary re-calculations
    const filterUsers = useMemo(() => {
        return allUser.filter(user => user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    },[allUser, searchTerm])
    

    const handleContacts = (user) => {
        contactHandler(user)
        setIsActive(user.uid)
    }

    const themeToggle = () => {
        setIsDarkTheme(!isDarkTheme)
    }

    const handleLogout = async() => {
        await logout()
        navigate("/login")
    }

    return (
        <div className="col-4 sidebar">
            <div className="user-info">
                <div>
                    <h5><i className="bi bi-list"></i></h5>
                    <p>{currentUser.displayName}</p>
                </div>
                <div>
                    <h5 onClick={themeToggle}><i className={ isDarkTheme ? 'bi bi-moon-fill' : 'bi bi-sun-fill'}></i></h5>
                    <h5 onClick={handleLogout}><i className="bi bi-box-arrow-left"></i></h5>
                </div>
            </div>
            <form className="form-group my-2" role="search">
                <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: 'white'}}>
                        <i className="bi bi-search"></i>
                    </span>
                    <input className="form-control form-control-sm searchBtn" onChange={(e) => setSearchTerm(e.target.value)} type="search" placeholder="Search" aria-label="Search" />
                </div>
            </form>
            <div className="contacts">
                {
                    filterUsers?.map((user, id) => (
                        <div className={`contacts-box ${isActive === user.uid ? 'active' : ''}`} key={user.uid} onClick={() => handleContacts(user)}>
                            <img src={avatar[id]} className="rounded-circle bg-light" alt={"https://api.dicebear.com/9.x/fun-emoji/svg/0.8576409603340307.svg"} style={{height:'40px', width:'40px'}}/>
                            <span>
                                <h4 className="card-title"><b>{user.displayName}</b></h4>
                                <p className="card-subtitle">Last message</p>
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar