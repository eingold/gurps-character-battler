import React from 'react'

const TextLog = ({ logText, setLogText }) => {

    const logStyle = {
        maxHeight: "300px",
        whiteSpace: "pre-line"
    }

    return (
        <>
            <div className='text-left overflow-auto' style={logStyle}> {logText}</div>
            <button onClick={() => setLogText("")}>Clear log</button>
        </>
    )
}

export default TextLog