import { useNavigate } from "react-router-dom"
import Card from "./Card"
import { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";
import auth from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";


const Register = () => {
    const {register, currentUser, updateUserProfile} = useAuth()

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false) 
    const [values, setValues] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    })


    const handleChange = ({target: {value, name}}) => {
        
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try 
        {
            setLoading(true)
            await register(values.email, values.password)
            const profile = {
                displayName: values.name,
            }

            const user = auth.currentUser;

            if (user) 
            {
                await updateUserProfile(user, profile);
                navigate('/login');
            }
        } 
        catch (error) 
        {
            alert('Error: ', error);
        }
        finally
        {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(currentUser)
        {
            navigate("/login")
        }
    },[currentUser, navigate])

    return (
        <Card>
            <p className="text-center lead">Create your ID</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input name="name" type="text" className="form-control" placeholder="Name" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <input name="username" type="text" className="form-control" placeholder="@username" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <input name="email" type="email" className="form-control" placeholder="Email address" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <input name="password" type="password" className="form-control" placeholder="Password" onChange={handleChange}/>
                    <small className="form-text text-muted">Password should be more than 6 characters</small>
                </div>
                <div className="account-form-btn">
                    <a href="/login" className="btn btn-danger">Cancel</a>
                    {
                        loading ?
                        <Spinner buttonName={"Loading..."}/>
                        :
                        <button type="submit" className="btn btn-primary">Create</button>
                    }
                </div>
            </form>
        </Card>
    )
}

export default Register