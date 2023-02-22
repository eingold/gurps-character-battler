import React from 'react'

const TextLog = ({ logText }) => {

    const logStyle = {
        height: "300px",
        whiteSpace: "pre-line"
    }

    return (
        <div className='text-left overflow-auto' style={logStyle}> {logText}</div >
    )
}

export default TextLog