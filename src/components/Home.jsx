import ChatLayout from "./UI/ChatLayout"
import Layout from "./UI/Layout"
import Navbar from "./UI/Navbar"
import UserLayout from "./UI/UserLayout"
import withAuth from "../utils/withAuth";

const Home = () => {
    return (
            <Layout>
                <div style={{height: "100%"}}>
                    <div>
                        <Navbar />
                    </div>
                    <div className="container">
                        <div className="row">
                            <UserLayout />
                            <ChatLayout />
                        </div>
                    </div>
                </div>                
            </Layout>
    )
}

export default withAuth(Home)