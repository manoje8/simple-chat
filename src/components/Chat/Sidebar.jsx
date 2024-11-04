import { useCallback, useEffect, useMemo, useState } from "react"
import { getUsersForSidebar } from "../../service/service"
import { useAuth } from "../../context/AuthContext"
import generateAvatar from "../../utils/avatarHelper"
import './Sidebar.css'
import Menubar from "./Menubar"

const Sidebar = () => {
    const { contactHandler, isDarkTheme, currentUser} = useAuth()
    const [allUser, setAllUser] = useState([])
    const [avatar, setAvatar] = useState([])
    const [isActive, setIsActive] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showMenu, setShowMenu] = useState(false);
    const [ loading, setLoading ] = useState(false)

    // Fetch all the contacts
    const fetchUsers = useCallback(async() => {
        try 
        {
            setLoading(true)
            const data = await getUsersForSidebar()
            setAllUser(data.users);
            setAvatar(generateAvatar()) // Automatically set profile
        } 
        catch (error) 
        {
            console.log("Error in fetching contacts: ",error);
        } 
        finally
        {
            setLoading(false)
        }
        
        
    },[setLoading])

    useEffect(() => {
        fetchUsers()
    },[fetchUsers])

    // Memoize the filtered users to prevent unnecessary re-calculations
    const filterUsers = useMemo(() => {
        return allUser.filter(user => user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    },[allUser, searchTerm])
    

    const handleContacts = (user) => {
        contactHandler(user) // Set the selected user
        setIsActive(user.uid)
    }

    // Menu toggle
    const handleMenu = () => {
        setShowMenu(!showMenu)
    }

    return (
        <div className={`col-4 sidebar ${isDarkTheme ? 'dark': 'light'}`}>
            <div>
                <Menubar showMenu={showMenu} handleMenu={handleMenu}/>
            </div>
            <div className="user-info">
                <div>
                    <h5 onClick={handleMenu}><i className='bi bi-list'></i></h5>
                    <p>{currentUser.displayName}</p>
                </div>
                <div>
                    <h5><i className="bi bi-globe"></i></h5> {/*Global Search*/}
                </div>
            </div>
            <form className="form-group" role="search">
                <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: 'white'}}>
                        <i className="bi bi-search"></i>
                    </span>
                    <input className="form-control form-control-sm searchBtn" onChange={(e) => setSearchTerm(e.target.value)} type="search" placeholder="Search" aria-label="Search" />
                </div>
            </form>
            <p className="my-2">Chats</p>
            <div className="contacts">
                {
                    loading ? <p className="blur-loader"></p> :
                    filterUsers?.map((user, id) => (
                        <div className={`contacts-box ${isActive === user.uid ? 'active' : ''}`} key={user.uid} onClick={() => handleContacts(user)}>
                            <img src={avatar[id]} className="rounded-circle bg-light" alt={"https://api.dicebear.com/9.x/fun-emoji/svg/0.8576409603340307.svg"} style={{height:'40px', width:'40px'}}/>
                            <span>
                                <h4 className="card-title"><b>{user.displayName}</b></h4>
                                <p className="card-subtitle">Last message</p>
                            </span>
                            {/* <span className="badge">14</span> Todo: Message notification */}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar