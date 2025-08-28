import Message from "./Message.tsx";
import axios from 'axios'
import {useEffect, useState, useRef, useCallback} from "react";

interface Props {
    token: string;
    apiHost: string;
    sockHost: string;
    channel: string;
}

interface LatestMessage {
    id: number;
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
}

function MessageListGroup(props: Props) {
    const { token, apiHost, sockHost, channel } = props
    // IT WILL BE FIXED I SWEAR
    const [messages, setMessages] = useState<Message[]>([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver>(null);
    const [page, setPage] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const sock = useRef<WebSocket | null>(null);
    const [alreadyScrolled, setAlreadyScrolled] = useState<boolean>(false);

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
        const message = JSON.parse(event.data)
        console.log(message)

        if (message.error === true) {
            sock.current?.close()
        }
        if (message.id != null && typeof message.id === "number") {
            const result = await axios.get<Message[]>(
                apiHost + "/messages/" + message.channel + "/" + message.id + "/?singleOnly=1",
                {headers: {
                    'x-auth-token': token
                }}
            )
            const notificationPreview = result.data[0].content.substring(0, 30) + "..."
            tryNotify(notificationPreview, false, result.data[0].name)

            if (message.channel != channel) { return }
            let tmpdate = new Date(result.data[0].date)
            result.data[0].date = tmpdate.toLocaleString()
            setMessages((previous) => [...previous, result.data[0]])
        }
    }


    useEffect(() => {
        if (token === "") { return }
        sock.current = new WebSocket(sockHost)
        sock.current.onopen = () => {
            sock.current?.send(JSON.stringify({
                token: token
            }))
        }
        sock.current.onmessage = (event) =>  {handleSocketMessage(event)}
    }, [token]);

    useEffect(() => {

    }, []);

    const lastPostElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        setPage((prevPage) => {
                            if (prevPage === null) {return prevPage;}
                            if (prevPage <= 19) {
                                console.log("hit end", prevPage);
                                setHasMore(false);
                                return prevPage;
                            }
                            console.log("Set page", prevPage - 20);
                            return prevPage - 20
                        })
                    }
                },
                { threshold: 1.0 }
            );
            if (node) {observer.current.observe(node)}
        },
        [loading, hasMore]
    )
    const fetchMessages = async (page: number | null) => {
        setLoading(true)
        try {
            if (page == null) {
                const latest = await axios.get<LatestMessage[]>(apiHost + '/messages/latest/' + channel, {
                    headers: {
                        'x-auth-token': token
                    }
                })
                return setPage(latest.data[0].id)
            }

            const loadId = page

            const result = await axios.get<Message[]>(apiHost + '/messages/' + channel + "/" + loadId, {
                headers: {
                    'x-auth-token': token
                    //TODO: add personal token rather than hardcoded
                }
            })
            for (let i = 0; i < result.data.length; i++) {
                let tmpdate = new Date(result.data[i].date)
                result.data[i].date = tmpdate.toLocaleString()
            }
            setMessages((prev) => [...result.data.reverse(), ...prev])
            if (result.data.length == 0) { return setHasMore(false) }
            // For some reason the mysql database starts at 1 rather than 0
            if (result.data[result.data.length - 1].id == 1) { setHasMore(false) }
        } catch (error) {
            console.error(error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("Scroll:", !alreadyScrolled)

        // keep the messages.length
        if (!alreadyScrolled && messages.length > 0) {
            let scrollheight = window.scrollY
            const container = messageContainerRef.current
            if (container !== null) {
                console.log("Scroll height set through container", container.scrollHeight)
                scrollheight = container.scrollHeight
            }
            console.log("Scrollheight", scrollheight)
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollheight,
                    behavior: 'instant'
                })
                setAlreadyScrolled(true)
            })
        }

    }, [messages, alreadyScrolled]);

    useEffect(() => {
        if (token === "") { return }
        fetchMessages(page)
    }, [page])


    return (<>
        <div className="message-container-master" ref={messageContainerRef}>
        {loading && (
            <div className="container">
                <span className="placeholder col-12 placeholder-lg placeholder-glow placeholder-wave"></span>
            </div>
        )}
        {error && <h1 className="error-text">There was an issue retrieving your messages...</h1>}
        {messages.length !== 0 && (
            messages.map((message, index) => {
            if (index === 0) {
                return (
                    <div ref={lastPostElementRef} key={message.id}>
                    <Message
                        date={message.date}
                        content={message.content}
                        reactions={message.reactions}
                        sendername={message.name}
                        senderid={message.senderid}
                        name_color={message.name_color}
                    />
                    </div>
                );
            } else {
            return (
                <Message
                    date={message.date}
                    content={message.content}
                    reactions={message.reactions}
                    sendername={message.name}
                    senderid={message.senderid}
                    key={message.id}
                    name_color={message.name_color}
                />
            );
            }

        }
        ))}
        </div>
    </>)
}



async function tryNotify(message: string, bypassFocus: boolean = false, title: string = document.title) {
    if (!bypassFocus && document.hasFocus()) {return;}
    if (Notification.permission !== 'granted') {await Notification.requestPermission()}
    new Notification(title, {
        body: message
    })
}

export default MessageListGroup;