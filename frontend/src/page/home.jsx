import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate("/register");
            }, 1000);
        }
    }, [token]);

    if (!token) {
        return (
            <div>Not logged ? ... Go authentificate please</div>
        )
    }

    return (
        <div>Home Page - Hello </div>
    )
}

export default Home;
