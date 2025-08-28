import {FormEvent, useState} from "react";
import axios from "axios";

interface Props {
    setToken: (token: string) => void;
    token: string;
    apiHost: string;
}


function UserPane(props: Props) {
    // @ts-ignore
    const { token, setToken, apiHost } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        try {
            getJWTFromLogin(username, password)
        } catch (error) {
            console.log(error);
        }
        setUsername("")
        setPassword("")
    }

    const getJWTFromLogin= async (name: string, password: string) => {
        try {
        const token = await axios.post(apiHost + "/auth", {
            userhandle: name,
            password: password
        })
        setToken(token.data.toString())
        } catch (error) {
            console.log(error);
            window.alert("Error logging in!")
        }
    }


    return (
        <>
            <div className="user-settings-pane">
                <h1>Login</h1>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div>
                    <input onChange={(event) => setUsername(event.target.value)}
                           type="text"
                           placeholder="Username (handle minus the @ sign)"
                           aria-label="Your Username"
                           aria-describedby="button-addon2"
                           className="textInput"
                           id="username-submit"
                           value={username}
                    />
                    </div>
                    <div>
                    <input onChange={(event) => setPassword(event.target.value)}
                           type="password"
                           placeholder="Password"
                           aria-label="Your Username"
                           aria-describedby="button-addon2"
                           className="textInput"
                           id="password-submit"
                           value={password}
                    />
                    </div>
                    <input type="submit" value="sign in"/>
                    <h5>*Note: some servers will not allow new accounts to be created</h5>
                </form>
            </div>
        </>
    )
}

export default UserPane;