import * as React from 'react';

export interface IWeb3ModalContextProviderProps {
    children?: React.ReactNode;
}

export interface IWeb3ModalContextProps {
    network: string;
    signer: string;
}

export const web3ModalContext: IWeb3ModalContextProps = {
    network: '',
    signer: '',
};

export const Web3ModalContext = React.createContext(web3ModalContext);

export function Web3ModalContextProvider({
    children,
}: IWeb3ModalContextProviderProps) {
    return (
        <Web3ModalContext.Provider value={web3ModalContext}>
            {children}
        </Web3ModalContext.Provider>
    );
}
