import MessageListGroup from "./components/MessageListGroup.tsx";
import MessageBar from "./components/MessageBar.tsx"

import './App.css'
import {useState, useEffect} from "react";
import Sidebar from "./components/Sidebar.tsx";
import { Channel } from "./components/Sidebar.tsx";
import NewChannelPopup from "./components/NewChannelPopup.tsx"
import Login from "./components/Login.tsx";
import RelayMessageBar from "./components/RelayMessageBar.tsx";
import RelayListGroup from "./components/RelayListGroup.tsx";

function App() {
    const [token, setToken] = useState("")
    const [apiHost] = useState("http://" + window.location.hostname + ":8080/api")
    const [sockHost] = useState("ws://" + window.location.hostname + ":8081")
    const [channel, setChannel] = useState("1")
    const [sidebar, setSidebar] = useState<boolean>(true);
    const [messageContainerSpacing, setMessageContainerSpacing] = useState<string>("0%")
    const [channels, setChannels] = useState<Channel[]>([])
    const [newChannelPrompt, setNewChannelPrompt] = useState(false)
    const [relaychannel, setRelaychannel] = useState(0)
    const [relayMode, setRelayMode] = useState(false)

    // Encryption
    //const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null)
    //const [publicKey, setPublicKey] = useState<CryptoKey | null>(null)


    useEffect(() => {
        if (sidebar) {
            setMessageContainerSpacing("20%")
        } else {
            setMessageContainerSpacing("0%")
        }
    }, [sidebar])

    return (<>
        { (token === "")  && <Login
            setToken={setToken}
            token={token}
            apiHost={apiHost}
        />}
            <div className="message-sidebar-spacer" style={{marginLeft: messageContainerSpacing}}>
                { (token !== "") && <>
                    {newChannelPrompt ? <NewChannelPopup setNewChannelPrompt={setNewChannelPrompt} apiHost={apiHost} token={token}/> : <></>}
                    <div className="message-master">
                        {(!newChannelPrompt && relayMode) && <RelayListGroup token={token} apiHost={apiHost} sockHost={sockHost} relaychannel={relaychannel} key={relaychannel}/>} 
                        {(!newChannelPrompt && !relayMode) && <MessageListGroup channel={channel} token={token} apiHost={apiHost} sockHost={sockHost} key={channel}/> }
                    </div>
                </> }
                { (token !== "" && !relayMode) && <MessageBar channel={channel} token={token} apiHost={apiHost} publicKey={null} sidebar={sidebar}/> }
                { (token !== "" &&  relayMode) && <RelayMessageBar relaychannel={relaychannel} token={token} apiHost={apiHost} sidebar={sidebar} key={relaychannel}/> }
            </div>
            <div className="message-sidebar-spacer">
                { (token !== "") && <Sidebar
                    apiHost={apiHost}
                    channel={channel}
                    setChannel={setChannel}
                    token={token}
                    setShow={setSidebar}
                    show={sidebar}
                    channels={channels}
                    setChannels={setChannels}
                    setNewChannelPrompt={setNewChannelPrompt}
                    newChannelPrompt={newChannelPrompt}
                    setRelayMode={setRelayMode}
                    setRelaychannel={setRelaychannel}
                />}
            </div>
        <hr className="bottom-spacer"/>
    </>)
}

export default App
