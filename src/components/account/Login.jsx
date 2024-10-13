import { useEffect, useState } from "react"
import Card from "../UI/Card"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Spinner from "../UI/Spinner"

const Login = () => {
    const navigate = useNavigate();
    const {currentUser, login} = useAuth();
    const [loading, setLoading] = useState(false)

    const [loginValue, setLoginValue] = useState({
        email: '',
        password: ''
    })

    const handleChange = ({target: {value, name}}) => {
        setLoginValue({
            ...loginValue,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try 
        {
            setLoading(true)
            await login(loginValue.email, loginValue.password)
        } 
        catch (error) 
        {
            alert("Error", error)
        }
        finally
        {
            setLoading(false)
        }
        
    }

    useEffect(() => {
        if(currentUser)
        {
            navigate('/')
        }
    },[currentUser, navigate])

    return (
        <Card>
            <p className="text-center lead">Login</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input name="email" type="email" className="form-control" placeholder="Email address" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <input name="password" type="password" className="form-control" placeholder="Password" onChange={handleChange}/>
                </div>
                {
                    loading ? 
                    <Spinner buttonName={"Login..."}/>
                    :
                    <button type="submit" className="btn btn-primary">Login</button>
                }
                
                <div className="account-form-btn">
                    <a href="/reset-password" className="btn">Forgot password? </a>
                    <a href="/register" className="btn btn-info">Create new ID</a>
                </div>
            </form>
        </Card>
    )
}

export default Login