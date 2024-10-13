import axios from "axios"
import auth from "../config/firebase"

const serverURL = process.env.REACT_APP_SERVER_URL;

export const getAccessToken = async() => {
    const user = auth.currentUser;
    const token = user && (await user.getIdToken())
    return token
    
}

export const sendMessage = async(message, recieverId) => {
    try 
    {
        const token = await getAccessToken()        

        const response = await axios({
            method: 'post',
            url: `${serverURL}/message/send/${recieverId}`,
            data: { message },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } 
    catch (error) 
    {
        throw error
    }
}

export const getMessagesById = async(id) => {
    try 
    {
        const token = await getAccessToken()

        const response = await axios({
            method: 'get',
            url: `${serverURL}/message/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } 
    catch (error) 
    {
        throw error
    }
}

export const deleteMessageById = async(id) => {
    try 
    {
        const response = await axios.delete(`${serverURL}/message/${id}`)

        return response.data
    } 
    catch (error) 
    {
        throw error
    }
}

export const getUsersForSidebar = async () => {
    try 
    {
        const token = await getAccessToken()
        const response = await axios({
            method: 'get',
            url: `${serverURL}/users`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } 
    catch (error) 
    {
        throw error
    }
}