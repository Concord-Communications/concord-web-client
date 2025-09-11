import Message from "./Message.tsx";
import {useEffect, useState, useRef} from "react";

interface Props {
    token: string;
    apiHost: string;
    sockHost: string;
    relaychannel: number;
}



interface Message {
    id: number;
    name: string;
    handle: string;
    senderid: number;
    content: string;
    reactions: string[];
    date: string;
    channelid: number;
    name_color: string;
    encryped: boolean;
    type: string; // make it so it can handle direct messages
}

function RelayListGroup(props: Props) {
    const { token, sockHost, relaychannel } = props
    // IT WILL BE FIXED I SWEAR
    const [messages, setMessages] = useState<Message[]>([])
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const sock = useRef<WebSocket | null>(null);

    // TODO: end to end encryption/decryption
    // not critical, but would be nice
    /*const decrypt = async (message: string, privateKey: CryptoKey, ivB64: string) => {
        // Everything is in base64 because it has to be stored as a string on the server
        const iv = new Uint8Array(atob(ivB64).split('').map(c => c.charCodeAt(0)));
        const encryptedData = new Uint8Array(atob(message).split('').map(c => c.charCodeAt(0)));
        const subtle = window.crypto.subtle;
        const result = await subtle.decrypt(
            {name: "AES-GCM", iv},
            privateKey,
            encryptedData
        )

        return new TextDecoder().decode(result)
    }*/

    const handleSocketMessage = async (event: MessageEvent) => {
        let message = JSON.parse(event.data)

        if (message.error === true) {
            sock.current?.close()
        }
        if (message.type == "direct_message") {
            message = (message as Message)

            const notificationPreview = message.content.substring(0, 30) + "..."
            tryNotify(notificationPreview, true, "")

            let tmpdate = new Date(message.date)
            message.date = tmpdate.toLocaleString()
            setMessages((previous) => [...previous, message])
        } else if (message.type == "relay") {
            message = (message as Message)

            const notificationPreview = message.content.substring(0, 30) + "..."
            tryNotify(notificationPreview, false, "")

            let tmpdate = new Date(message.date)
            message.date = tmpdate.toLocaleString()
            setMessages((previous) => [...previous, message])
        }
    }


    useEffect(() => {
        if (token === "") { return }
        sock.current = new WebSocket(sockHost)
        sock.current.onopen = async () => {
            await sock.current?.send(JSON.stringify({
                token: token
            }))
            await new Promise(resolve => setTimeout(resolve, 1000)) // rate limiting
            sock.current?.send(relaychannel.toString())
        }
        sock.current.onmessage = (event) =>  {handleSocketMessage(event)}
    }, [token]);

    return (<>
        <h1 style={{marginTop: "25px"}}>Relay {relaychannel}</h1>
        <div className="message-container-master" ref={messageContainerRef}>
        {messages.length !== 0 && (
            messages.map((message) => {
            return(
                <Message
                    date={message.date}
                    content={message.content}
                    reactions={message.reactions}
                    sendername={message.name}
                    senderid={message.senderid}
                    key={message.id}
                    name_color={message.name_color}
                    sender_handle={message.handle}
                />
            )
        }
        ))}
        </div>

        {messages.length < 3 && <h5 style={{left: "50%", color: "#ca3d36ff"}}>Remember: a relay is not more secure than a regular channel! Use concord for good, please. &#40;{Math.abs(messages.length - 3)}&#41;</h5>}
    </>)
}



async function tryNotify(message: string, bypassFocus: boolean = false, title: string = document.title) {
    if (!bypassFocus && document.hasFocus()) {return;}
    if (Notification.permission !== 'granted') {await Notification.requestPermission()}
    new Notification(title, {
        body: message
    })
}

export default RelayListGroup;