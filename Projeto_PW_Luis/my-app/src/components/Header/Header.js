import React, { useState } from 'react';
import SearchInput from '../SearchInput/SearchInput';
import Clock from '../Clock/Clock';
import styles from "./Header.module.css";
import logo from "../assets/logo2.png";
import { Link } from 'react-router-dom';

const Header = (props) => {
    const [searchKey, setSearchKey] = useState('');

    const searchChangeHandler = (searchKey) => {
        setSearchKey(searchKey);
    }

    return (
        <header className={styles.header}>
            <div className={styles["top-bar"]}>
                <img className={styles.logo} src={logo} alt="Logo" />
                <Clock />
                <div className={styles["auth-links"]}>
                    <Link to="/login" className={styles.link}>Login</Link>
                    <Link to="/register" className={styles.link}>Register</Link>
                </div>
            </div>
            <div className={styles["header-content"]}>
                <h3>Biblioteca Municipal De Felgueiras</h3>
                <div className={styles["input-container"]}>
                    <div>
                        <SearchInput onSearchChange={searchChangeHandler} />
                        <div className={styles["search-summary"]}>
                            <small>Search for: {searchKey}</small>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
