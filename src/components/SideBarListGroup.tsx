import {Channel} from "./Sidebar.tsx";
import NotificationBadge from "./NotificationBadge.tsx";

interface Props {
channels: Channel[]
setChannel: (channel: string) => void
channel: string
token: string
apiHost: string
setNewChannelPrompt: (NewChannelPrompt: boolean) => void
newChannelPrompt: boolean
}

function SideBarListGroup(props: Props) {
    const { channels, setChannel } = props;

    const switchChannel = async (newChannel: number) => {
        console.log("switch channel", newChannel);
        setChannel(newChannel.toString())
    }

    const accentColor = "#00f2ffff";
    const textColor = "#ffffffff";


    return (<>
        {channels.map((channel) => (
            <>
                <div className="bar-item" onClick={() => switchChannel(channel.id)} key={channel.id}>
                    <h4 style={{color: parseInt(props.channel) == channel.id ? accentColor : textColor}}>{channel.name}</h4>
                    {channel.notifications && <NotificationBadge notifications={channel.notifications}/>}
                </div>
            </>
        ))}
        <h5 onClick={() => {props.setNewChannelPrompt(true)}} className="newchannel-buttontext">add channel</h5>
    </>)
}

export default SideBarListGroup;