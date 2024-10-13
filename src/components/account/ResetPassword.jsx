import { useState } from "react"
import Card from "../UI/Card"
import Spinner from "../UI/Spinner"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const ResetPassword = () => {
    const navigate = useNavigate()
    const {resetPassword} = useAuth()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try 
        {
            setLoading(true)
            await resetPassword(email)
            navigate("/login")
        } 
        catch (error) 
        {
            alert("Error", error);           
        }
        finally
        {
            setLoading(false)
        }
    }

    return (
        <Card>
            <form className="reset-form" onSubmit={handleSubmit}> 
            <p className="lead text-center">Reset password</p>
                <input type="text" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                <div className="text-center">
                    {
                        loading ?
                        <Spinner buttonName={"Sending"}/>
                        :
                        <button className="btn btn-dark">Reset</button>
                    }
                </div>
            </form>
        </Card>
    )
}

export default ResetPassword