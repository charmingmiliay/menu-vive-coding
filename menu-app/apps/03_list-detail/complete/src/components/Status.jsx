function Status({ type, message }) {
    return <p className={`status status-${type}`}>{message}</p>;
}

export default Status;
