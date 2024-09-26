import { useCallback, useEffect, useState } from "react"
import { getUsersForSidebar } from "../../service/service"
import { useAuth } from "../../context/AuthContext"
import generateAvatar from "../../utils/avatarHelper"

const UserLayout = () => {
    const {setMessageReciever} = useAuth()
    const [allUser, setAllUser] = useState([])
    const [avatar, setAvatar] = useState([])

    const fetchUsers = useCallback(async() => {
        const data = await getUsersForSidebar()
        setAllUser(data.users);
        setAvatar(generateAvatar())
        
    },[])

    useEffect(() => {
        fetchUsers()
    },[fetchUsers])
    
    

    return (
        <div className="col-4 vh-50 p-2 user-layout">
            <form className="form-group my-2" role="search">
                <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: 'white'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </span>
                    <input className="form-control form-control-sm searchBtn" type="search" placeholder="Search" aria-label="Search" />
                </div>
            </form>
            <div>
                {
                    allUser?.map((user, id) => (
                        <div className="contacts-box" key={id} onClick={() => setMessageReciever(user)}>
                            <img src={avatar[id]} className="rounded-circle bg-light" alt={"https://api.dicebear.com/9.x/fun-emoji/svg/0.8576409603340307.svg"} style={{height:'40px', width:'40px'}}/>
                            <span>
                                <h5 className="card-title">{user.displayName}</h5>
                                <h6 className="card-subtitle">Last message</h6>
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default UserLayout