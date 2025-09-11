import {Channel} from "./Sidebar.tsx";
import NotificationBadge from "./NotificationBadge.tsx";
import { MessagesSquare, MessageCircleDashed } from "lucide-react";
import { FormEvent, useState } from "react";

interface Props {
channels: Channel[]
setChannel: (channel: string) => void
channel: string
token: string
apiHost: string
setNewChannelPrompt: (NewChannelPrompt: boolean) => void
newChannelPrompt: boolean
setRelayMode: (relaymode: boolean) => void
setRelaychannel: (relaychannel: number) => void
}

function SideBarListGroup(props: Props) {
    const { channels, setChannel, setRelayMode, setRelaychannel } = props;
    const [tmpRelayChannel, setTmpRelayChannel] = useState<number | null>(null)

    const switchChannel = async (newChannel: number) => {
        setChannel(newChannel.toString())
        setRelayMode(false)
    }


    const accentColor = "#00f2ffff";
    const textColor = "#ffffffff";

    const handleRelaySubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (tmpRelayChannel === null || tmpRelayChannel > 100 || tmpRelayChannel < 1) {
            return window.alert("Relay channel must be 1 through 100")
        }
        setRelayMode(true)
        setRelaychannel(tmpRelayChannel)
    }

    return (<>
        <div style={{display: "flex", flexDirection: "row", gap: "15px"}}>
            <MessagesSquare color="white" size="30"/>
            <h3>Channels</h3>
        </div>
        {channels.map((channel) => (
            <>
                <div className="bar-item" onClick={() => switchChannel(channel.id)} key={channel.id}>
                    <h4 style={{color: parseInt(props.channel) == channel.id ? accentColor : textColor}}>{channel.name}</h4>
                    {channel.notifications && <NotificationBadge notifications={channel.notifications}/>}
                </div>
            </>
        ))}
        <h5 onClick={() => {props.setNewChannelPrompt(true)}} className="newchannel-buttontext">add channel</h5>
        <div style={{display: "flex", flexDirection: "row", gap: "15px"}}>
            <MessageCircleDashed color="white" size="29"/>
            <h3>Relays</h3>
        </div>
        <form onSubmit={handleRelaySubmit}>
            <input type="number" className="textInput"
                aria-label="1..100"
                aria-describedby="button-addon2"
                id="relaychannelsubmit"
                value={tmpRelayChannel?.toString()}
                onChange={(event) => {setTmpRelayChannel(parseInt(event.target.value))}}
            />
            <input type="submit" value="join"/>
        </form>
    </>)
}

export default SideBarListGroup;