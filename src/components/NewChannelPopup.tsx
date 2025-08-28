import {FormEvent, useState} from "react";
import axios from "axios";

interface Props {
    setNewChannelPrompt: (NewChannelPrompt: boolean) => void
    apiHost: string
    token: string
}

function NewChannelPopup(props: Props) {
    const { apiHost, setNewChannelPrompt, token } = props;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        try {
            await axios.post(apiHost + "/info/channels/new", 
                {
                    channel_name: name,
                    description: description 
                },
                {
                    headers: {
                        'x-auth-token': token
                    }}
            )
            window.location.reload()

        } catch (error) {
            console.error(error);
            window.alert("Error creating a new channel, see log")
        }
        setName("")
        setDescription("")
    }



    return (
        <>
            <div className="user-settings-pane">
                <h1>New Channel</h1>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div>
                    <input onChange={(event) => setName(event.target.value)}
                           type="text"
                           placeholder="Channel Name"
                           aria-label="Channel Name"
                           aria-describedby="button-addon2"
                           className="textInput"
                           id="channel-name-submit"
                           value={name}
                    />
                    </div>
                    <div>
                    <input onChange={(event) => setDescription(event.target.value)}
                           type="text"
                           placeholder="Channel Description"
                           aria-label="Channel Description"
                           aria-describedby="button-addon2"
                           className="textInput"
                           id="channel-description-submit"
                           value={description}
                    />
                    </div>
                    <button onClick={() => setNewChannelPrompt(false)}>cancel</button>
                    <input type="submit" value="create"/>
                    <h5>*Note: changes will reflect after a refresh*</h5>
                </form>
            </div>
        </>
    )
}

export default NewChannelPopup