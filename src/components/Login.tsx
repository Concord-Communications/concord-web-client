import CreateUserPane from "./CreateUserPane";
import UserPane from "./UserPane";
import { useState } from "react";

interface Props {
    setToken: (token: string) => void;
    token: string;
    apiHost: string;
}

function Login(props: Props) {
    const {token, setToken, apiHost} = props
    const [registerNewUser, setRegisterNewUser] = useState(false) // to use the CreateUserPane instead of the UserPane
    return (
        <>
            { registerNewUser ?  
                <CreateUserPane 
                    token={token}
                    setToken={setToken}
                    apiHost={apiHost}
                    setRegisterNewUser={setRegisterNewUser}
                /> :
                <UserPane
                    token={token}
                    setToken={setToken}
                    apiHost={apiHost}
                    setRegisterNewUser={setRegisterNewUser}
                />
            }
        </>
    )
}

export default Login;