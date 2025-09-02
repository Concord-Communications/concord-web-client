import {FormEvent, useState} from "react";
import axios from "axios";

interface Props {
    setToken: (token: string) => void;
    token: string;
    apiHost: string;
    setRegisterNewUser: (registerNewUser: boolean) => void;
}


function CreateUserPane(props: Props) {
    // @ts-ignore
    const { token, setToken, apiHost } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("")
    const [inviteCode, setInviteCode] = useState<string>("")

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        try {
            getJWTFromLogin(username, password)
        } catch (error) {
            console.log(error);
        }
        setUsername("")
        setPassword("")
        setDisplayName("")
    }

    const getJWTFromLogin = async (name: string, password: string) => {
        try {
        const response = await axios.post(apiHost + "/auth/register", {
            name: displayName,
            userhandle: name,
            password: password,
            description: ""
        }, {headers: 
            {'x-invite-token': inviteCode}
        })
        setToken(response.headers['x-auth-token'])
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
                    <input onChange={(event) => setDisplayName(event.target.value)}
                            type="text"
                            placeholder="Display Name"
                            className="textInput"
                            aria-describedby="button-addon2"
                            aria-label="Display Name"
                            id="displayNameInput"
                            value={displayName}
                            required={true}
                    />
                    <input onChange={(event) => setUsername(event.target.value)}
                           type="text"
                           placeholder="Handle (don't include an @ sign)"
                           aria-label="Your Username"
                           aria-describedby="button-addon2"
                           className="textInput"
                           id="username-submit"
                           value={username}
                           required={true}
                    />
                    </div>
                    <div>
                    <input onChange={(event) => setPassword(event.target.value)}
                           type="password"
                           placeholder="Password"
                           aria-label="Your password"
                           aria-describedby="button-addon2"
                           className="textInput"
                           id="password-submit"
                           value={password}
                           required={true}
                    />
                    <input onChange={(event) => setInviteCode(event.target.value)}
                        type="password"
                        placeholder="invite-code"
                        aria-label="invite code (sometimes required)"
                        aria-describedby="invite code (sometimes required)"
                        className="textInput"
                        id="id-submit"
                        value={inviteCode}
                        required={false}
                    />
                    </div>
                    <input type="submit" value="create user"/>
                    <h5>*Note: some servers will not allow new accounts to be created</h5>
                </form>
                <button onClick={() => props.setRegisterNewUser(false)}>Already have an account?</button>
            </div>
        </>
    )
}

export default CreateUserPane;