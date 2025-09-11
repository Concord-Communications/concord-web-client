import {useRef, useState} from "react";
import axios from "axios";

interface Props {
    token: string;
    apiHost: string;
    relaychannel: number;
    sidebar: boolean;
}

function RelayMessageBar(props: Props) {
    const { token, apiHost, relaychannel} = props;
    const [userInput, setUserInput] = useState("");
    const textref = useRef<HTMLTextAreaElement>(null)
    const handleSubmit = async () => {
        try {
            await axios.post(apiHost + '/messages/relays/' + relaychannel.toString(),
                {
                    content: userInput,
                    encrypted: false,
                    iv: null,
                },
                {
                headers: {
                    'x-auth-token': token
                    //TODO: add personal token rather than hardcoded
                },
            })
            setUserInput("")
        } catch (error) {
            window.alert("There was an error sending your message")
            console.log(error);
        }
    }

    const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
       if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault() // don't add newline
            if (userInput.trim().length < 1) {
                return
            }
            handleSubmit()
            if (textref.current) {textref.current.style.height = "auto"}
       }
    }

    const handleInput = () => {
        if (textref.current) {
            textref.current.style.height = "auto"
            textref.current.style.height = textref.current.scrollHeight + "px"
        }
    }



    return (<>
        <div className="message-input-container">
           <textarea
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeydown}
                onInput={handleInput}
                className="message-bar"
                value={userInput}
                placeholder={"message Relay " + relaychannel}
           /> 

        </div>

    </>)
}


export default RelayMessageBar;