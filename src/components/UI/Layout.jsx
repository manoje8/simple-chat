import { useAuth } from "../../context/AuthContext"

const Layout = ({children}) => {
    const {isDarkTheme} = useAuth()
    return (
        <div className={`container-fluid ${isDarkTheme ? 'dark' : 'light'}`} style={{height: "100vh"}}>
            {children}
        </div>
    )
}

export default Layout