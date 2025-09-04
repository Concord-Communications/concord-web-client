import {useRef, useState} from "react";
import axios from "axios";

interface Props {
    token: string;
    apiHost: string;
    channel: string;
    publicKey: CryptoKey | null;
    sidebar: boolean;
}

function MessageBar(props: Props) {
    const encrypt = async (text: string, key: CryptoKey | null) => {
        if (key === null) {return {iv: "", ciphertext: text, encrypted: false}}
        const subtle = window.crypto.subtle;
        const iv = window.crypto.getRandomValues(new Uint8Array(12))
        const enc = new TextEncoder().encode(text)

        const ciphertext = await subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            enc
        )

        // Convert to Base64 for transmission
        const ivBase64 = btoa(String.fromCharCode(...iv));
        const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
        
        return { iv: ivBase64, ciphertext: ciphertextBase64, encrypted: true}
    }
    const { token, apiHost, channel, publicKey } = props;
    const [userInput, setUserInput] = useState("");
    const textref = useRef<HTMLTextAreaElement>(null)
    const handleSubmit = async () => {
        try {
            const encrypted = await encrypt(userInput, publicKey)
            await axios.post(apiHost + '/messages/' + channel,
                {
                    content: encrypted.ciphertext,
                    iv: encrypted.iv,
                    encrypted: encrypted.encrypted, // if there is no key provided it will return false
                },
                {
                headers: {
                    'x-auth-token': token
                    //TODO: add personal token rather than hardcoded
                },
            })
        } catch (error) {
            window.alert("There was an error sending your message")
            console.log(error);
        }
        setUserInput("")
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
                placeholder="Your message here sire"
           /> 
        </div>
    </>)
}


export default MessageBar