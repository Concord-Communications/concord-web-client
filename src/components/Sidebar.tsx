import {useEffect, useState} from "react";
import axios from "axios";
import SideBarListGroup from "./SideBarListGroup.tsx";
import { PanelRightClose } from "lucide-react"

export interface Channel {
    id: number
    name: string
    description: string
    lastMessageid: null | number
    notifications: null | number
}

interface Props {
    apiHost: string
    channel: string
    setChannel: (channel: string) => void
    token: string
    show: boolean
    setShow: (show: boolean) => void
    channels: Channel[]
    setChannels: (channels: Channel[]) => void
    setNewChannelPrompt: (newChannelPrompt: boolean) => void
    newChannelPrompt: boolean
    setRelayMode: (relayMode: boolean) => void
    setRelaychannel: (relaychannel: number) => void
}


function Sidebar(props: Props) {
    const { apiHost, token, setChannel, show, setShow, setChannels, channels } = props;
    const [channelsFlag, setChannelsFlag] = useState<boolean>(false); // tell the getReadStatus method to fire

    const getReadStatus = async () => {
        for (let i = 0; i < channels.length; i++) {
            try {
                setChannels(
                    // @ts-ignore
                    prev => {
                    const newValue = [...prev]
                    if (newValue[i].lastMessageid === null) {
                        return newValue
                    }
                    return newValue
                })
            } catch (error) {
                console.error(error)
            }

        }
    }



    const getChannels = async () => {
        const response = await axios.get<Channel[]>(apiHost + '/info/channels', {headers: {
                "x-auth-token": token
            }})
        setChannels(response.data)
        setChannelsFlag(!channelsFlag)
    }



    useEffect(() => {
        getChannels()
    }, [])

    useEffect(() => {
        getReadStatus()
    }, [channelsFlag]);



    const sidebarMain = () => {
        return (
            <>
                <div className="sidebar">
                    <div style={{padding: '20px'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <h2>Concord</h2>
                        <button className="sidebar-button" onClick={() => setShow(!show)}>
                            X
                        </button>
                    </div>
                    <div style={{maxHeight: '80%'}}>
                    <SideBarListGroup 
                        channels={channels}
                        setChannel={setChannel}
                        token={token}
                        apiHost={apiHost}
                        channel={props.channel}
                        setNewChannelPrompt={props.setNewChannelPrompt}
                        newChannelPrompt={props.newChannelPrompt}
                        setRelayMode={props.setRelayMode}
                        setRelaychannel={props.setRelaychannel}
                    />
                    </div>
                    </div>
                </div>
            </>
        )
    }

    const sideBarButton = () => {
        return (
            <>
                <button className="sidebar-button" onClick={() => setShow(!show)}>
                    <PanelRightClose size="48px"/>
                </button>
            </>
        )
    }

    return (
        <>
            {show && sidebarMain()}
            {!show && sideBarButton()}
        </>
    )

}

export default Sidebar;