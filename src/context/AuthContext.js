import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import auth from "../config/firebase";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [ authLoading, setAuthLoading] = useState(true);
    const [ contacts, setContacts ] = useState([]);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => signOut(auth)

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const updateUserProfile = (user, name) => {
        return updateProfile(user, name)
    }

    const fetchUser = useCallback(() => {
        const response =  auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            setAuthLoading(false)
        })
        return response
    },[])

    useEffect(() => {
        return fetchUser();
    },[fetchUser])
    
    // Handler for set the select user
    const contactHandler = (contact) => {
        setContacts(contact)
    }

    const context = {
        currentUser,
        register,
        login,
        logout,
        resetPassword,
        updateUserProfile,
        contacts,
        contactHandler,
        isDarkTheme,
        setIsDarkTheme,
    }

    return <AuthContext.Provider value={context}>{!authLoading && children}</AuthContext.Provider>
}

export default AuthProvider