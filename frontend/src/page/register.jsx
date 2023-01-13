import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const onClick = () => {
        window.location = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e4321f4102944a4d6a845589617dc4dbb76d41480231e1640aa6a19b02a8a5a3&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code`
    }

    const fn = async (c) => {
        const r = await fetch(`http://localhost:3042/auth?code=${c}`);
        searchParams.delete('code');
        const data = await r.json()
        if (!data.error) {
            localStorage.setItem("token", JSON.stringify(data));
            navigate('/')
        }
    }

    const [searchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.has('code')) {
            fn(searchParams.get('code'));
        } 
    }, []);

    return (
        <div>
            Continuer
            <br />
            <button onClick={onClick}>42 sign-in</button>
        </div>
    );
};

export default Register;
