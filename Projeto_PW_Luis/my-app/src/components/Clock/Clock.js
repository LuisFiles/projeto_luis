import React, { useState, useEffect } from 'react';
import styles from './Clock.module.css';

const Clock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className={styles.clock}>
            <span>{`0${currentTime.getHours()}`.slice(-2)}</span>:
            <span>{`0${currentTime.getMinutes()}`.slice(-2)}</span>:
            <span>{`0${currentTime.getSeconds()}`.slice(-2)}</span>
        </div>
    );
};

export default Clock;
