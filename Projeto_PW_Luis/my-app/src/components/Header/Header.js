import React, { useState } from 'react';
import Clock from '../Clock/Clock';
import styles from "./Header.module.css";
import logo from "../assets/logo2.png";

const Header = (props) => {
    const [searchKey, setSearchKey] = useState('');

    const searchChangeHandler = (event) => {
        setSearchKey(event.target.value);
    }

    const searchHandler = () => {
        console.log("Searching for:", searchKey);
        // Add search functionality here
    }

    return (
        <header className={styles.header}>
            <div className={styles["top-bar"]}>
                <img className={styles.logo} src={logo} alt="Logo" />
                <div className={styles.clock}><Clock /></div>
            </div>
            <div className={styles["header-content"]}>
                <h3>Biblioteca Municipal De Felgueiras</h3>
                <div className={styles["input-container"]}>
                    <input 
                        type="text"     
                        placeholder="Search for books..." 
                        value={searchKey} 
                        onChange={searchChangeHandler} 
                    />
                    <button onClick={searchHandler}>Search</button>
                </div>
            </div>
        </header>
    );
}

export default Header;
