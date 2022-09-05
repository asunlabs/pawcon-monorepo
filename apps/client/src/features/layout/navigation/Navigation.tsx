import * as React from 'react';
import './Navigation.css';
import logo from './pawcon-logo.svg';
import { Buttom } from '../button/Button';

function handleSIWE() {
    console.log('auth 1');
}

function handleWalletConnect() {
    console.log('auth 2');
}

const ToggleContext = React.createContext(false);

interface IToggleContextProviderProps {
    children?: React.ReactNode;
}

function ToggleContextProvider({ children }: IToggleContextProviderProps) {
    const [toggle, setToggle] = React.useState(false);

    return (
        <ToggleContext.Provider value={toggle}>
            <div className="navigationBar" id="trigger">
                <span id="logotype">PawCon</span>
                <img src={logo} alt="logo" loading="lazy" />
                <span
                    id="menuTrigger"
                    onClick={() => {
                        setToggle(!toggle);
                    }}
                >
                    {/*
                     * &#9776; => ≡,  &#10005 => X
                     */}
                    {toggle ? <span>&#9776;</span> : <span>&#10005;</span>}
                </span>
            </div>
            {children}
        </ToggleContext.Provider>
    );
}

function MenuBar() {
    const toggle = React.useContext(ToggleContext);
    return (
        <ul className="navigationBar" id={toggle ? 'menu' : 'disabled'}>
            <li className="menuItem">
                <a href="#asunMint">AsunMint</a>
            </li>
            <li className="menuItem">
                <a href="#asunSwap">AsunSwap</a>
            </li>
            <li className="menuItem" onClick={handleSIWE}>
                <Buttom
                    className="menuBarButton"
                    text="Sign in with Ethereum"
                    callback={handleSIWE}
                />
            </li>
            <li className="menuItem" onClick={handleWalletConnect}>
                <Buttom
                    className="menuBarButton"
                    text="Connect wallet"
                    callback={handleWalletConnect}
                />
            </li>
        </ul>
    );
}

export function Navigation() {
    return (
        <nav id="nav">
            <ToggleContextProvider>
                <MenuBar />
            </ToggleContextProvider>
        </nav>
    );
}
