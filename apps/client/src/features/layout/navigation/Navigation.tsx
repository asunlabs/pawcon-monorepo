import * as React from 'react';
import './Navigation.css';
import logo from './pawcon-logo.svg';
import { Buttom } from '../button/Button';
import { breakpoint } from '../../../app/type';

function handleSIWE() {
    console.log('auth 1');
}

function handleWalletConnect() {
    console.log('auth 2');
}

function TriggerBar() {
    return (
        <div className="navigationBar" id="trigger">
            <span id="logotype">PawCon</span>
            <img src={logo} alt="logo" />
            <img src={logo} alt="burger" />
        </div>
    );
}

function MenuBar() {
    return (
        <ul className="navigationBar" id="menu">
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

export interface INavigationProps {}

export function Navigation(props: INavigationProps) {
    return (
        <nav id="nav">
            <TriggerBar />
            <MenuBar />
        </nav>
    );
}
