import * as React from 'react';
import './Navigation.css';
import { breakpoint } from '../../../app/type';
import { Buttom } from '../button/Button';
import { ethers } from 'ethers';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3Modal from 'web3modal';
import { INFURA_PROJECT_ID } from '../../../app/config/setup';
import { IWeb3ModalContextProps } from '../../../app/context/Web3ModalContext';
function handleSIWE() {
    console.log('auth 1');
}

async function handleWalletConnect() {
    const web3modal = new Web3Modal({
        providerOptions: {
            coinbasewallet: {
                package: CoinbaseWalletSDK,
                options: {
                    appName: 'PawCon',
                    infuraId: INFURA_PROJECT_ID, // Required
                    darkMode: true,
                },
            },
        },
    });

    console.log({ INFURA_PROJECT_ID });

    const instance = await web3modal.connect();
    let provider = new ethers.providers.Web3Provider(instance);
    let _signer = provider.getSigner();

    let network = (await provider.detectNetwork()).name;
    let signer = await _signer.getAddress();

    return {
        network,
        signer,
    };
}

const ToggleContext = React.createContext(false);

interface IToggleContextProviderProps {
    children?: React.ReactNode;
}

function ToggleContextProvider({ children }: IToggleContextProviderProps) {
    const [toggle, setToggle] = React.useState(false);
    const tabletSize: breakpoint = 768;

    // * Media query
    React.useEffect(() => {
        window.addEventListener('resize', () => {
            if (window.innerWidth > tabletSize) {
                setToggle(true);
            }
        });
    }, []);

    return (
        <ToggleContext.Provider value={toggle}>
            <div className="navigationBar" id="trigger">
                <span id="logotype">PawCon</span>
                <img
                    src={'https://i.ibb.co/2tfRH08/pawcon-logo.png'}
                    alt="logo"
                    loading="lazy"
                />
                <span
                    id="menuTrigger"
                    onClick={() => {
                        setToggle(!toggle);
                    }}
                >
                    {/*
                     * &#9776; => ≡,  &#10005 => X
                     */}
                    {toggle ? <span>&#10005;</span> : <span>&#9776;</span>}
                </span>
            </div>
            {children}
        </ToggleContext.Provider>
    );
}

function MenuBar() {
    const toggle = React.useContext(ToggleContext);
    const [web3ModalUser, setWeb3ModalUser] =
        React.useState<IWeb3ModalContextProps>();

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
            <li className="menuItem">
                {web3ModalUser?.signer !== undefined ? (
                    <div>
                        <span>network: {web3ModalUser.network}</span>
                        <p>signer: {web3ModalUser.signer}</p>
                    </div>
                ) : (
                    <Buttom
                        className="menuBarButton"
                        text="Connect wallet"
                        callback={async () => {
                            const { network, signer } =
                                await handleWalletConnect();
                            setWeb3ModalUser({ network, signer });
                        }}
                    />
                )}
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
