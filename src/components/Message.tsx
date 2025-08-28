interface Props {
    sendername: string;
    senderid: number;
    content: string;
    reactions: string[];
    date: string;
    name_color: string;
}
function Message(props: Props) {
    return (<>
        <div className="message-container">
            <div className="message-header">
                <h3 className="user-title" style={{ color: props.name_color }}>{props.sendername}</h3>
                <h6 className="date">{props.date}</h6>
            </div>
            <h4 style={{ whiteSpace: 'pre-line'}}>{props.content}</h4>
            <div>
                {props.reactions.map((reaction) => (
                    <h4>{reaction}</h4>
                ))}
            </div>
        </div>
        <hr />
    </>)
}


export default Message