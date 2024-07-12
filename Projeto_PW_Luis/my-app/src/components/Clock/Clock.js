import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000)

        return () => {
            clearInterval(intervalId);
        }
    })


return (
    <span> 
            <span> {`0${ currentTime.getHours()}`.slice(-2)}</span>:
            <span> {`0${ currentTime.getMinutes()}`.slice(-2)}</span>:
            <span> {`0${ currentTime.getSeconds()}`.slice(-2)}</span>
    </span>
)
}

export default Clock