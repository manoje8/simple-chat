const Card = ({children}) => {
    return (
        <div className="container login-container">
            <div className="box-container">
                {children}
            </div>
        </div>
    )
}

export default Card