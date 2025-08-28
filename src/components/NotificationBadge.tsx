interface Props {
notifications: number | null;
}

function NotificationBadge(props: Props) {
    const { notifications } = props;
    return (
        <>
            {notifications !== null && (
                <h3 className="notification-dot">{notifications}</h3>
            )}
        </>
    )
}

export default NotificationBadge;