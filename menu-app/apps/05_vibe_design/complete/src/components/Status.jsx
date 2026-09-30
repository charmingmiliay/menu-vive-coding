function Status({ type, message }) {
    return (
        <div className={`status status-${type}`} role={type === 'error' ? 'alert' : 'status'}>
            <span className="status-dot" aria-hidden="true" />
            {message}
        </div>
    );
}

export default Status;
